import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

interface SuccessViewProps {
  data: {
    recordId: string;
    handoverCode: string;
    itemCode: string;
  };
  onBack: () => void;
}

export function SuccessView({ data, onBack }: SuccessViewProps) {
  // Using the exact URL format the user requested, pointing to the specific record in Feishu
  const qrUrl = `https://sansecool.feishu.cn/wiki/BmGhwGL0Ii1D1UkvZbXcd3RNnbg?table=tblax44lHRKR6qEi&view=vewHGx9xRv&record=${data.recordId}`;

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">登记成功</h2>
        <p className="text-slate-500 mb-8">物品信息已同步至飞书多维表格</p>

        <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-2">交接验证码</p>
          <div className="text-5xl font-mono font-bold text-red-600 tracking-widest mb-4">
            {data.handoverCode}
          </div>
          <p className="text-xs text-slate-400 font-mono">物品编码: {data.itemCode}</p>
        </div>

        <div className="w-full mb-8 flex flex-col items-center">
          <p className="text-sm font-medium text-slate-700 mb-4">使用飞书扫码确认交接</p>
          <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-4">
            <QRCodeSVG value={qrUrl} size={180} level="H" />
          </div>
          <a 
            href={qrUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            在飞书中打开记录 <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 text-base font-bold bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> 返回继续登记
        </button>
      </div>
    </div>
  );
}
