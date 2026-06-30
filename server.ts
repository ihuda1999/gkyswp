import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  // API Route to submit to Feishu
  app.post("/api/feishu/report", async (req, res) => {
    try {
      const { name, category, foundLocation, description, isHighValue, overallPhoto, detailPhoto, finderName } = req.body;
      
      const appId = process.env.FEISHU_APP_ID || "cli_aaaaaca94278dcff";
      const appSecret = process.env.FEISHU_APP_SECRET || "G0NGEocPASsjlHNsULjmgcUwNPZdlyZo";
      const appToken = process.env.FEISHU_APP_TOKEN || "T5t5bhAR9a9H4CsRd4fc3i3rnGf";
      const rawTableId = process.env.FEISHU_TABLE_ID || "tblax44lHRKR6qEi";
      const tableId = rawTableId.split('&')[0].split('?')[0];

      console.log("Using feishu config:", { appId, appToken, tableId });

      if (!appId || !appSecret || !appToken || !tableId) {
        return res.status(500).json({ error: "Feishu credentials are not fully configured in environment variables." });
      }

      // 1. Get Tenant Access Token
      const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: appId, app_secret: appSecret })
      });
      const tokenData = await tokenRes.json();
      const token = tokenData.tenant_access_token;

      if (!token) {
        throw new Error("Failed to authenticate with Feishu API: " + JSON.stringify(tokenData));
      }

      // Resolve actual appToken if it's a wiki token
      let realAppToken = appToken;
      const wikiRes = await fetch(`https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${appToken}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const wikiData = await wikiRes.json();
      if (wikiData.code === 0 && wikiData.data?.node?.obj_token) {
         realAppToken = wikiData.data.node.obj_token;
      }

      // Helper to upload base64 image to Feishu Bitable
      const uploadImage = async (base64Str: string, filename: string) => {
        if (!base64Str) return null;
        
        // Extract content type and base64 data
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
           return null;
        }
        
        const buffer = Buffer.from(matches[2], 'base64');
        
        // We must construct a multipart/form-data request manually or use a library
        // Since we are in node >= 18, we can use standard FormData
        const formData = new FormData();
        const blob = new Blob([buffer], { type: matches[1] });
        formData.append('file', blob, filename);
        formData.append('parent_type', 'bitable_image');
        formData.append('parent_node', realAppToken);
        formData.append('size', buffer.length.toString());
        formData.append('file_name', filename);

        const uploadRes = await fetch('https://open.feishu.cn/open-apis/drive/v1/medias/upload_all', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData as any
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.code !== 0) {
           console.error("Feishu image upload failed:", uploadData);
           return null;
        }
        
        return uploadData.data.file_token;
      };

      // 2. Upload Photos
      const overallFileToken = await uploadImage(overallPhoto, 'overall.jpg');
      const detailFileToken = await uploadImage(detailPhoto, 'detail.jpg');

      // 3. Generate Handover Code
      const handoverCode = Math.floor(100000 + Math.random() * 900000).toString();
      const itemCode = `WP${handoverCode}`;

      // 4. Fetch available fields to check if 物品编码 and 交接码 exist
      const fieldsRes = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${realAppToken}/tables/${tableId}/fields`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fieldsData = await fieldsRes.json();
      const availableFields = fieldsData.data?.items?.map((item: any) => item.field_name) || [];

      // 5. Create Record
      const fields: any = {
        "物品": name,
        "物品类别": category,
        "贵重物品": isHighValue ? "是" : "否",
        "区域": foundLocation?.zone || "",
        "桌号": foundLocation?.table || "",
        "外观特征描述": description
      };

      if (availableFields.includes("物品编码")) {
          fields["物品编码"] = itemCode;
      }
      if (availableFields.includes("交接码")) {
          fields["交接码"] = handoverCode;
      }
      if (availableFields.includes("登记人") && finderName) {
          fields["登记人"] = finderName;
      } else if (availableFields.includes("记录人") && finderName) {
          fields["记录人"] = finderName;
      }

      const photos = [];
      if (overallFileToken) {
         photos.push({ file_token: overallFileToken });
      }
      if (detailFileToken) {
         photos.push({ file_token: detailFileToken });
      }

      if (photos.length > 0) {
         fields["物品照片上传"] = photos;
      }

      const recordRes = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${realAppToken}/tables/${tableId}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      });

      const recordData = await recordRes.json();
      
      if (recordData.code !== 0) {
        throw new Error("Failed to insert record: " + JSON.stringify(recordData) + " | Config: " + JSON.stringify({ appId, appToken: realAppToken, tableId }));
      }

      res.json({ 
        success: true, 
        data: recordData.data,
        handoverCode,
        itemCode
      });
    } catch (error: any) {
      console.error("Feishu API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // API Route to authenticate Feishu user via OAuth code
  app.post("/api/feishu/auth", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ error: "Missing authorization code" });

      const appId = process.env.FEISHU_APP_ID || "cli_aaaaaca94278dcff";
      const appSecret = process.env.FEISHU_APP_SECRET || "G0NGEocPASsjlHNsULjmgcUwNPZdlyZo";

      // 1. Get app access token first
      const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: appId, app_secret: appSecret })
      });
      const tokenData = await tokenRes.json();
      const appAccessToken = tokenData.app_access_token;

      if (!appAccessToken) {
         throw new Error("Failed to get app_access_token");
      }

      // 2. Exchange code for user access token
      const userTokenRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/oidc/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appAccessToken}`
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code
        })
      });
      const userTokenData = await userTokenRes.json();
      
      if (userTokenData.code !== 0) {
        throw new Error("Failed to get user access token: " + JSON.stringify(userTokenData));
      }

      const userAccessToken = userTokenData.data.access_token;

      // 3. Get user info
      const userInfoRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/user_info', {
        headers: {
          'Authorization': `Bearer ${userAccessToken}`
        }
      });
      const userInfoData = await userInfoRes.json();

      if (userInfoData.code !== 0) {
        throw new Error("Failed to get user info: " + JSON.stringify(userInfoData));
      }

      res.json({ success: true, user: userInfoData.data });
    } catch (error: any) {
      console.error("Feishu Auth Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
