import React, { useState, useEffect } from 'react';
import ReportForm from './components/ReportForm';
import { SuccessView } from './components/SuccessView';
import { LogIn, Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'form' | 'success'>('form');
  const [successData, setSuccessData] = useState<{recordId: string, handoverCode: string, itemCode: string} | null>(null);

  useEffect(() => {
    // Check for Feishu OAuth code in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      setIsAuthenticating(true);
      fetch('/api/feishu/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser({
            name: data.user.name,
            avatar: data.user.avatar_url,
            role: 'receptionist' // default role
          });
        } else {
           alert('登录失败: ' + (data.error || '未知错误'));
        }
        // Remove code from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch(err => {
        console.error('Failed to authenticate:', err);
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
    }
  }, []);

  const loginWithFeishu = () => {
    const appId = "cli_aaaaaca94278dcff"; // Using the known App ID
    const redirectUri = encodeURIComponent(window.location.origin);
    window.location.href = `https://open.feishu.cn/open-apis/authen/v1/user_auth_page_beta?app_id=${appId}&redirect_uri=${redirectUri}`;
  };
  
  const handleReportSubmit = async (item: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...item, finderName: currentUser?.name || '未知操作员' };
      const response = await fetch('/api/feishu/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
         setSuccessData({
           recordId: data.data.record.record_id,
           handoverCode: data.handoverCode,
           itemCode: data.itemCode
         });
         setView('success');
      } else {
         alert('上报失败：' + (data.error || '未知错误') + '\n\n请联系管理员检查后台配置（App Token 和 Table ID）。');
      }
    } catch (error) {
      alert('网络请求失败：' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setView('form');
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">正在登录飞书...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <LogIn className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">顾客遗失物品管理系统</h1>
          <p className="text-slate-500 mb-8">请使用飞书登录以继续操作，系统将自动记录您的信息作为登记人。</p>
          <button
            onClick={loginWithFeishu}
            className="w-full py-4 text-base font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            使用飞书登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500/30 relative z-0 overflow-hidden">
      {/* Modern SaaS Header Background */}
      <div className="absolute top-0 inset-x-0 h-[45vh] bg-gradient-to-b from-red-600 to-red-800 -z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-400 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
        <div className="absolute top-10 -left-32 w-96 h-96 bg-orange-400 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <header className="mb-10 flex flex-col items-start">
          <div className="flex items-center gap-4 drop-shadow-sm">
            <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-md shrink-0 overflow-hidden border-2 border-white">
              <img src="/logo.png" alt="胡大" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              顾客遗失物品登记单
            </h1>
          </div>
        </header>

        <main>
          <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-red-900/10 p-6 sm:p-10 md:p-12 border border-white relative">
            {/* Decorative element inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-50 to-orange-50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            
            {view === 'form' ? (
              <ReportForm 
                currentUser={currentUser}
                onSubmit={handleReportSubmit}
                onCancel={() => console.log('Cancelled')}
                isSubmitting={isSubmitting}
              />
            ) : (
              successData && <SuccessView data={successData} onBack={resetForm} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
