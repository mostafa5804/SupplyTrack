import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useSettings } from '../store/SettingsContext';
import { api } from '../lib/utils';
import { 
  Save, 
  Wallet, 
  Settings2, 
  FileText, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Smartphone, 
  Layers, 
  HelpCircle,
  X,
  Trash2,
  Info
} from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const { settings, refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'general' | 'sms_settings' | 'sms_templates' | 'sms_logs'>('general');
  const [smsCredit, setSmsCredit] = useState<number | null>(null);
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; credit?: number } | null>(null);
  
  // Custom toast notification system
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const [formData, setFormData] = useState<any>({
    projectName: '',
    companyName: '',
    logoUrl: '',
    smsEnabled: false,
    smsApiKey: '',
    smsLineNumber: '',
    smsSendMode: 'bulk',
    smsNotifyRequester: true,
    smsNotifySupervisor: true,
    smsNotifyStorekeeper: true,
    smsNotifyPurchaser: true,
    smsTemplateIds: {},
    smsTemplates: {}
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        ...formData,
        ...settings,
        smsTemplateIds: settings.smsTemplateIds || {},
        smsTemplates: settings.smsTemplates || {}
      });
    }
  }, [settings]);

  useEffect(() => {
    if (activeTab === 'sms_settings') {
      fetchCredit();
    } else if (activeTab === 'sms_logs') {
      fetchLogs();
    }
    setTestResult(null);
  }, [activeTab]);

  const fetchCredit = async () => {
    if (!formData.smsApiKey) return;
    try {
      const res = await api.get('/sms/credit');
      if (res.data.error) {
        setSmsCredit(null);
      } else {
        setSmsCredit(res.data.credit);
      }
    } catch (err) {
      setSmsCredit(null);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/sms/logs');
      setSmsLogs(res.data || []);
    } catch (err) {
      setSmsLogs([]);
    }
  };

  const handleTestConnection = async () => {
    if (!formData.smsApiKey) {
      showNotification('لطفاً ابتدا کلید API را وارد کنید.', 'error');
      return;
    }
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const res = await api.post('/sms/test-connection', { apiKey: formData.smsApiKey });
      if (res.data.success) {
        setTestResult({
          success: true,
          message: res.data.message || 'اتصال با موفقیت برقرار شد.',
          credit: res.data.credit
        });
        setSmsCredit(res.data.credit);
        showNotification('اتصال وب‌سرویس پیامک موفقیت‌آمیز بود.', 'success');
      } else {
        setTestResult({
          success: false,
          message: res.data.message || 'خطا در تایید اعتبار کلید API.'
        });
        showNotification('خطا در اتصال به وب‌سرویس پیامک', 'error');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.message || err.message || 'خطا در ارتباط با وب‌سرویس پیامک. وضعیت شبکه را بررسی کنید.'
      });
      showNotification('خطا در تست اتصال وب‌سرویس', 'error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-center p-12 text-destructive font-bold text-lg">شما دسترسی به این بخش را ندارید.</div>;
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.put('/settings', formData);
      showNotification('تنظیمات با موفقیت ذخیره شد.', 'success');
      refreshSettings();
    } catch (e) {
      showNotification('خطا در ذخیره تنظیمات سیستم.', 'error');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('⚠️ اخطار بسیار مهم: آیا از پاک کردن تمام اطلاعات (درخواست‌ها، کاربران، تاریخچه و کالاها) اطمینان کامل دارید؟ این عمل غیرقابل بازگشت است.')) {
      try {
        await api.post('/reset');
        showNotification('تمامی اطلاعات با موفقیت بازنشانی شد.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (e) {
        showNotification('خطا در بازنشانی اطلاعات سیستم.', 'error');
      }
    }
  };

  const handleTemplateChange = (key: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      smsTemplates: {
        ...(prev.smsTemplates || {}),
        [key]: val
      }
    }));
  };

  const handleTemplateIdChange = (key: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      smsTemplateIds: {
        ...(prev.smsTemplateIds || {}),
        [key]: val
      }
    }));
  };

  const smsEventsList = [
    { key: 'req_submitted_requester', label: 'ثبت درخواست (برای درخواست‌کننده)', desc: 'هنگام ایجاد درخواست جدید توسط کاربر' },
    { key: 'req_submitted_supervisor', label: 'ثبت درخواست (برای سرپرست جهت تایید)', desc: 'اعلان به سرپرست دپارتمان جهت تایید درخواست' },
    { key: 'req_approved_requester', label: 'تایید سرپرست (برای درخواست‌کننده)', desc: 'هنگام موافقت سرپرست با اقلام درخواستی' },
    { key: 'req_approved_storekeeper', label: 'تایید سرپرست (برای انباردار)', desc: 'اعلان بررسی موجودی در انبار کارخانه' },
    { key: 'req_rejected_requester', label: 'رد درخواست (برای درخواست‌کننده)', desc: 'در صورت عدم موافقت سرپرست با درخواست' },
    { key: 'req_shortage_purchaser', label: 'کسری انبار (برای مامور خرید)', desc: 'اعلان خرید کالاهای دارای کسری موجودی' },
    { key: 'req_wh_supplied_requester', label: 'آماده تحویل از انبار (برای درخواست‌کننده)', desc: 'هنگام آماده شدن بخشی یا کل اقلام در انبار' },
    { key: 'req_delivered_requester', label: 'تحویل کالا (برای درخواست‌کننده)', desc: 'اعلان نهایی پس از تحویل فیزیکی کالاها' },
    { key: 'req_purchased_supervisor', label: 'خرید کالا (برای سرپرست دپارتمان)', desc: 'اعلان تامین و شارژ کالا در انبار' },
    { key: 'req_purchased_requester', label: 'خرید کالا (برای درخواست‌کننده)', desc: 'اعلان تحویل کالا به انبار و آماده بودن برای وی' },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 max-w-5xl mx-auto w-full px-1">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 left-5 z-[200] max-w-sm w-full animate-bounce shadow-xl border rounded-xl overflow-hidden">
          <div className={`p-4 flex items-start gap-3 ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className="text-sm font-bold">
                {toast.type === 'success' ? 'عملیات موفق' : toast.type === 'error' ? 'خطا در سیستم' : 'اطلاعیه'}
              </p>
              <p className="text-xs mt-0.5 leading-relaxed font-semibold">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header with Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
        <div>
          <h3 className="font-bold text-foreground text-lg lg:text-xl">تنظیمات پیشرفته سیستم</h3>
          <p className="text-xs text-muted-foreground mt-1">مدیریت ویژگی‌های عمومی، الگوهای پیامکی و درگاه وب‌سرویس SMS.ir</p>
        </div>
        
        <div className="flex bg-muted/55 rounded-xl p-1 overflow-x-auto hide-scrollbar border border-border">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2 text-xs lg:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'general' ? 'bg-background shadow-sm text-primary border border-border/10' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Settings2 size={16} />
            پیکربندی عمومی
          </button>
          <button 
            onClick={() => setActiveTab('sms_settings')}
            className={`flex items-center gap-2 px-4 py-2 text-xs lg:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'sms_settings' ? 'bg-background shadow-sm text-primary border border-border/10' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Wallet size={16} />
            تنظیمات پیامک
          </button>
          <button 
            onClick={() => setActiveTab('sms_templates')}
            className={`flex items-center gap-2 px-4 py-2 text-xs lg:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'sms_templates' ? 'bg-background shadow-sm text-primary border border-border/10' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FileText size={16} />
            قالب و رویدادها
          </button>
          <button 
            onClick={() => setActiveTab('sms_logs')}
            className={`flex items-center gap-2 px-4 py-2 text-xs lg:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'sms_logs' ? 'bg-background shadow-sm text-primary border border-border/10' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Activity size={16} />
            تاریخچه ارسال پیامک
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-card border border-border rounded-2xl p-4 lg:p-7 shadow-sm transition-all min-h-[450px] flex flex-col justify-between">
        
        {/* TAB 1: GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" /> مشخصات کلی سامانه تدارکات
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2 text-muted-foreground">نام سامانه (پروژه)</label>
                  <input 
                    type="text" 
                    value={formData.projectName || ''} 
                    onChange={e => setFormData({...formData, projectName: e.target.value})} 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-semibold" 
                    placeholder="سامانه هوشمند تدارکات کالا"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-muted-foreground">نام شرکت / سازمان</label>
                  <input 
                    type="text" 
                    value={formData.companyName || ''} 
                    onChange={e => setFormData({...formData, companyName: e.target.value})} 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-semibold" 
                    placeholder="شرکت فولاد صنعت"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold mb-2 text-muted-foreground">لوگوی شرکت یا کارخانه (اختیاری)</label>
              <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border border-dashed">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-border p-1.5 bg-white shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-border border-dashed flex items-center justify-center text-[10px] text-muted-foreground bg-secondary/40">فاقد لوگو</div>
                )}
                <div className="space-y-1.5">
                  <input 
                    type="file" 
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="logo-upload"
                    className="inline-block cursor-pointer bg-primary hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    بارگذاری تصویر لوگو
                  </label>
                  {formData.logoUrl && (
                    <button onClick={() => setFormData({...formData, logoUrl: ''})} className="text-xs text-destructive hover:underline block mr-1">حذف لوگوی فعلی</button>
                  )}
                  <p className="text-[10px] text-muted-foreground">فرمت‌های مجاز: PNG, JPG با حداکثر حجم ۵۰۰ کیلوبایت</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
              <button onClick={handleResetData} className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                <Trash2 size={16} /> پاکسازی و بازنشانی دیتابیس سامانه
              </button>
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                <Save size={16} /> ذخیره مشخصات عمومی
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SMS DRIVER SETTINGS */}
        {activeTab === 'sms_settings' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-5 items-stretch">
              {/* SMS Panel Info (Left) */}
              <div className="flex-1 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100/70 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-primary flex items-center gap-1.5 mb-1.5">
                    <Smartphone className="w-5 h-5 text-primary" /> اعتبار پنل پیامکی SMS.ir
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    سیستم تدارکات کالا برای اطلاع‌رسانی از طریق درگاه وب‌سرویس پیامکی معتبر کشور <strong className="text-foreground">sms.ir</strong> استفاده می‌کند.
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block font-bold">موجودی عددی پنل شما:</span>
                    {smsCredit !== null ? (
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-extrabold text-blue-900">{smsCredit.toLocaleString('fa-IR')}</span>
                        <span className="text-xs text-muted-foreground font-bold">پیامک</span>
                      </div>
                    ) : (
                      <span className="text-sm text-rose-600 block mt-1 font-semibold">کلید API تنظیم نشده یا نامعتبر است</span>
                    )}
                  </div>
                  <button onClick={fetchCredit} className="p-2 bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1 text-xs font-bold">
                    <RefreshCw size={14} /> به‌روزرسانی اعتبار
                  </button>
                </div>
              </div>

              {/* Status & Master Switch (Right) */}
              <div className="flex-1 border border-border p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                    <Layers className="w-4 h-4 text-foreground" /> وضعیت درگاه پیامک
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    با غیرفعال‌سازی این بخش، کلیه پیامک‌های تدارکات انباردار و پرسنل موقتاً متوقف خواهند شد.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between bg-secondary/30 px-4 py-3 rounded-xl border border-border">
                  <span className="text-xs font-bold text-foreground">ارسال پیامک در سامانه فعال باشد:</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.smsEnabled || false} 
                      onChange={e => setFormData({...formData, smsEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Config Fields Form */}
            <div className={`space-y-5 transition-all ${!formData.smsEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <h4 className="text-sm font-bold text-foreground mb-1 border-b border-border pb-2 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" /> پیکربندی درگاه وب‌سرویس
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2 text-muted-foreground">کلید اختصاصی API Key (دریافتی از پنل sms.ir)</label>
                  <input 
                    type="password" 
                    value={formData.smsApiKey || ''} 
                    onChange={e => setFormData({...formData, smsApiKey: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary text-left font-mono transition-all"
                    dir="ltr"
                    placeholder="رمز طولانی API Key صادر شده در پنل"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">این کلید در سرور به‌طور کاملاً امن ذخیره می‌شود و هرگز به مرورگر کاربران ارسال نخواهد شد.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold mb-2 text-muted-foreground">شماره خط اختصاصی ارسال پیامک</label>
                  <input 
                    type="text" 
                    value={formData.smsLineNumber || ''} 
                    onChange={e => setFormData({...formData, smsLineNumber: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary text-left font-mono transition-all"
                    dir="ltr"
                    placeholder="3000..."
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">شماره خط مجازی پیامک شما در سامانه sms.ir (معمولاً با ۳۰۰۰ یا ۱۰۰۰ شروع می‌شود).</p>
                </div>
              </div>

              {/* Mode Selection Grid */}
              <div className="bg-muted/15 border border-border p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <span className="text-xs font-bold text-foreground block mb-1">حالت ارسال پیامک‌ها (Send Mode)</span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    <strong>Bulk:</strong> ارسال سریع متون مستقیم شما. <br />
                    <strong>Verify (پیشنهادی):</strong> استفاده از قالب‌های از پیش ثبت‌شده و تاییدشده پنل جهت ارسال آنی و بدون عبور از فیلتر بلک‌لیست مخابرات.
                  </p>
                </div>
                <div className="flex bg-muted/60 p-1 rounded-xl border border-border">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, smsSendMode: 'bulk'})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.smsSendMode === 'bulk' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    حالت ارسال Bulk (ساده)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, smsSendMode: 'verify'})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.smsSendMode === 'verify' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    حالت ارسال Verify (قالبی)
                  </button>
                </div>
              </div>

              {/* Test Connection Component */}
              <div className="bg-secondary/20 border border-border rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-foreground">تست آنلاین اتصال به وب‌سرویس</h5>
                    <p className="text-[10px] text-muted-foreground">صحت کلید API و ارتباط با وب‌سرویس پیامکی را به صورت زنده بررسی کنید.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="bg-primary hover:bg-blue-600 disabled:bg-primary/50 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {isTestingConnection ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        در حال برقراری ارتباط...
                      </>
                    ) : (
                      <>تست اتصال به وب‌سرویس</>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all ${
                    testResult.success ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-rose-50/50 border-rose-200 text-rose-800'
                  }`}>
                    <div className="flex items-start gap-2">
                      {testResult.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold">{testResult.success ? 'ارتباط برقرار شد' : 'اتصال ناموفق بود'}</p>
                        <p className="text-[11px] mt-1 font-semibold">{testResult.message}</p>
                        {testResult.success && testResult.credit !== undefined && (
                          <p className="text-[11px] mt-1 font-bold">اعتبار پنل شما در این لحظه: {testResult.credit.toLocaleString('fa-IR')} پیامک است.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Role Switches */}
              <div className="pt-2">
                <label className="block text-xs font-bold mb-3 text-muted-foreground">گیرندگان پیش‌فرض اطلاع‌رسانی پیامک:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: 'smsNotifyRequester', label: 'درخواست‌کننده کالا' },
                    { key: 'smsNotifySupervisor', label: 'سرپرستان دپارتمان' },
                    { key: 'smsNotifyStorekeeper', label: 'انبارداران کارخانه' },
                    { key: 'smsNotifyPurchaser', label: 'مامورین خرید' }
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer bg-secondary/10 p-3 rounded-xl border border-border hover:border-primary/20 transition-all">
                      <input 
                        type="checkbox" 
                        checked={formData[item.key] !== false} 
                        onChange={e => setFormData({...formData, [item.key]: e.target.checked})} 
                        className="accent-primary w-4 h-4 shrink-0 rounded" 
                      />
                      <span className="text-xs font-bold text-foreground">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                <Save size={16} /> ذخیره تنظیمات پیامک
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TEMPLATES & EVENT ROUTING */}
        {activeTab === 'sms_templates' && (
          <div className="space-y-6">
            <div className="bg-blue-50/70 border border-blue-100 text-blue-800 p-4 rounded-xl text-xs leading-relaxed flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">راهنمای پیکربندی الگوهای متنی و قالبی:</span>
                <p>
                  شما می‌توانید برای هر یک از ۱۰ رویداد کلیدی جریان کالا در کارخانه، متون پیامک دلخواه را تنظیم کنید. در تمامی متون متغیرهای 
                  <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono mx-1 font-bold">{"{{id}}"}</code> (شماره درخواست) و 
                  <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono mx-1 font-bold">{"{{user}}"}</code> (نام کاربر درخواست‌کننده) 
                  به صورت خودکار توسط موتور پردازش سرور جایگذاری خواهند شد.
                </p>
                {formData.smsSendMode === 'verify' && (
                  <p className="mt-1.5 font-bold text-blue-900 border-t border-blue-150 pt-1.5">
                    💡 توجه: از آنجا که سیستم روی حالت ارسال Verify (قالبی) تنظیم است، وارد کردن "کد قالب (Template ID)" ثبت شده و تایید شده شما در پنل sms.ir برای هر رویداد الزامی است.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              {smsEventsList.map((tpl, index) => (
                <div key={tpl.key} className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-2xs hover:border-primary/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono">
                          {index + 1}
                        </span>
                        {tpl.label}
                      </span>
                      <p className="text-[10px] text-muted-foreground mr-6">{tpl.desc}</p>
                    </div>

                    {/* Template ID Input if Send Mode is Verify */}
                    {formData.smsSendMode === 'verify' && (
                      <div className="mt-2 sm:mt-0 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">کد قالب (Template ID):</span>
                        <input 
                          type="text"
                          value={formData.smsTemplateIds?.[tpl.key] || ''}
                          onChange={e => handleTemplateIdChange(tpl.key, e.target.value)}
                          placeholder="کد عددی قالب"
                          className="w-28 bg-muted/40 border border-border rounded-lg px-2.5 py-1 text-xs font-mono text-center text-primary font-bold outline-none focus:border-primary"
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Message Input */}
                  <div className="mr-0 sm:mr-6">
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1">متن پیامک (ارسالBulk یا به عنوان پیش‌فرض):</label>
                    <textarea 
                      value={formData.smsTemplates?.[tpl.key] || ''}
                      onChange={(e) => handleTemplateChange(tpl.key, e.target.value)}
                      className="w-full h-14 bg-muted/20 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:bg-background focus:border-primary transition-all resize-none font-semibold leading-relaxed"
                      placeholder="پیام کوتاه..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                <Save size={16} /> ذخیره قالب‌ها و رویدادها
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SMS SENDS HISTORY LOGS */}
        {activeTab === 'sms_logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h4 className="font-bold text-foreground text-sm lg:text-base">تاریخچه و لاگ سیستم پیامک</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">آرشیو آخرین ارسال‌های پیامک با جزئیات وضعیت و خطاهای دریافتی</p>
              </div>
              <button onClick={fetchLogs} className="text-xs bg-secondary/80 hover:bg-secondary text-foreground px-3.5 py-2 border border-border rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-3xs">
                <RefreshCw size={12} /> به‌روزرسانی تاریخچه
              </button>
            </div>
            
            {smsLogs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-2xl bg-muted/5">
                <Smartphone className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                هیچ لاگ ارسالی در سیستم یافت نشد.
              </div>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1.5 custom-scrollbar">
                {smsLogs.map((log) => (
                  <div key={log.id} className="bg-background border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          log.status === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50' : 'bg-rose-100 text-rose-800 border border-rose-200/50'
                        }`}>
                          {log.status === 'success' ? '✓ موفق' : '✕ ناموفق'}
                        </span>
                        
                        <span className="text-[10px] font-bold text-muted-foreground">{log.date}</span>
                        
                        <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50 dir-ltr">
                          {log.mobiles}
                        </span>
                      </div>
                      
                      <div className="bg-muted/10 p-2.5 rounded-lg border border-border/40 text-xs text-foreground font-semibold leading-relaxed whitespace-pre-wrap">
                        {log.message}
                      </div>

                      {log.error && (
                        <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 mt-1.5">
                          <AlertTriangle size={12} className="shrink-0" />
                          خطا: {log.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
