
// 服务端统一下划线赋值, 前端统一驼峰接收, 不遵守的就干 - 2021-05-27
  window.__pageStartTime = new Date().getTime();
  window.deviceInfoBySSO = {
    appId: '2',
    loginAppId: '',
    deviceId: '0',
    deviceModel: '',
    deviceName: '',
    deviceOs: ''
  };
  window.ENV = 'online'
  window.locales = ["zh-CN","zh-HK","zh-TW","en-US","ja-JP","id-ID","ms-MY","de-DE","es-ES","fr-FR","it-IT","pt-BR","ru-RU","vi-VN","th-TH","ko-KR"]
  window.needRedirect = 'false'
  window.crossLoginUrl = ''
  window.redirectUrl = ''
  window.passport_web_did = '7657164247550184657'
  window.rootDomain = 'feishu.cn'
  window.client_block = false
  window.serverInjectRes = {"appId":"2","captcha_service_url":"https://internal-api.feishu.cn/","client_block":false,"deviceId":"0","deviceModel":"","deviceName":"","deviceOs":"","forceAccountLogin":false,"locales":["zh-CN","zh-HK","zh-TW","en-US","ja-JP","id-ID","ms-MY","de-DE","es-ES","fr-FR","it-IT","pt-BR","ru-RU","vi-VN","th-TH","ko-KR"],"loginAppId":"","need_redirect":false,"passport_service_url":"https://internal-api-lark-api.feishu.cn/","passport_web_did":"7657164247550184657","rootDomain":"feishu.cn","template":{},"choose_identity_page":null,"no_permission_page":null,"pwd_less_auth_page":null,"grayLoginDpopProtect":true,"dpopKeypairRefreshable":null,"grayLoginNpwdTab":true,"middlePageData":null,"entranceText":{},"isPrivateKA":false,"isKA":false,"isBOE":false,"unit":"eu_nc","region":"cn","ENV":"online","cross_brand_entrance":"切换至Lark登录","cross_brand_entrance_url":"https://www.larksuite.com/accounts/cross_login/auth?app_id=2&origin_web_did=2f6b79e8b03ca1937524d968d06c9688&redirect_uri=https%3A%2F%2Fsansecool.feishu.cn%2Fwiki%2FQdyhwum8QiFT3nkADHhcQ8sUnBc%3Ffrom%3Dfrom_copylink%26login_redirect_times%3D4","dpop_keypair_refreshable":true,"passportSettings":{"ssr_failed":false,"biz_domain_config":{"passport_turing":["verify.zijieapi.com"]},"domain_config":{"internalApiLarkApiDomain":"internal-api-lark-api.feishu.cn","slardarReportDomain":"slardar-bd.feishu.cn","slardarJSCDN":"https://lf3-short.ibytedapm.com/slardar/fe/sdk-web/browser.cn.js","teaReportOrigin":"https://mcs-bd.feishu.cn","turingApiDomain":"verify.zijieapi.com","captchaIdScriptDomain":"internal-api.feishu.cn"},"appSettings":{"doubao_idp_gray_control":{"percent":100,"black_list":[],"white_list":["111900001","111900002","111900003","111900004","111900005","111900006","111900007","111900008","111900009","111900010","111900011","111900012","111900013","111900014","111900015","111900016","111900017","111900018","111900019","111900020","111900021","111900022","111900023","111900024","111900025","111900026","111900027","111900028","111900029","111900030","111900031","111900032","111900033","111900034","111900035","111900036","111900037","111900038","111900039","111900040","111900041","111900042","111900043","111900044","111900045","111900046","111900047","111900048","111900049","111900050","111900051","111900052","111900053","111900054","111900055","111900056","111900057","111900058","111900059","111900060","111900061","111900062","111900063","111900064","111900065","111900066","111900067","111900068","111900069","111900070","111900071","111900072","111900073","111900074","111900075","111900076","111900077","111900078","111900079","111900080","111900081","111900082","111900083","111900084","111900085","111900086","111900087","111900088","111900089","111900090","111900091","111900092","111900093","111900094","111900095","111900096","111900097","111900098","111900099","111900100","7390314174856577028","7332015469540884484","7554325907264831491","7553936439449226783","7541358282225664002"],"device_id":"7657164247532686540"}}},"grayBaseLark":false,"dpopStorage":"indexedDB","grayNpwdTab":{"gray_npwd_tab":{"close_tab_delay_ms":2000,"use_client_schema":true,"login":{"gray":100,"white_list":[]}}},"loginBffConfig":{"doubao_redirect":{"enable":true,"radio":10000,"passport_web_did":{"white_list":["20260514001","20260514002","20260514003","20260514004"],"black_list":[]}},"doubao_redirect_phase_2":{"enable":true,"radio":10000,"passport_web_did":{"white_list":["20260514001","20260514002","20260514003","20260514004"],"black_list":[]}},"doubao_redirect_phase_3":{"enable":true,"radio":10000,"passport_web_did":{"white_list":["20260514001","20260514002","20260514003","20260514004"],"black_list":[]}}},"notLoadGTM":false,"hiddenLoginAuthorizeButton":false}
  window.grayLoginDpopProtect = true
  window.dpopKeypairRefreshable = true
  window.grayLoginNpwdTab = true
  window.grayBaseLark = false
  window.middlePageData = null
  window.noPermissionPageData = null
  window.pwdLessAuthPageData = null
  // 区分KA集群
  window.isKA = false
  window.isPrivateKA = false // 私有部署
  window.unit = 'eu_nc';
  window.KAConfig = {
    channel: '',
    entranceText: {}
  }
  window.crossConfig = {
    crossBrandEntrance: '切换至Lark登录',
    crossBrandUrl: 'https://www.larksuite.com/accounts/cross_login/auth?app_id=2&origin_web_did=2f6b79e8b03ca1937524d968d06c9688&redirect_uri=https%3A%2F%2Fsansecool.feishu.cn%2Fwiki%2FQdyhwum8QiFT3nkADHhcQ8sUnBc%3Ffrom%3Dfrom_copylink%26login_redirect_times%3D4'
  }

  window.forceAccountLogin = false
  if (typeof (window.serverInjectRes) !== 'object') {
    window.serverInjectRes = null;
  }

  // ISV
  window.template = {}
