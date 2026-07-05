import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useSettings } from '../store/SettingsContext';
import { api } from '../lib/utils';
import { Save, Wallet, Settings2, FileText, Activity } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const { settings, refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'general' | 'sms_settings' | 'sms_templates' | 'sms_logs'>('general');
  const [smsCredit, setSmsCredit] = useState<number | null>(null);
  const [smsLogs, setSmsLogs] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    projectName: '',
    companyName: '',
    logoUrl: '',
    smsEnabled: false,
    smsApiKey: '',
    smsLineNumber: '',
    smsNotifyRequester: true,
    smsNotifySupervisor: true,
    smsNotifyStorekeeper: true,
    smsNotifyPurchaser: true,
    smsTemplates: {}
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (activeTab === 'sms_settings') {
      fetchCredit();
    } else if (activeTab === 'sms_logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchCredit = async () => {
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
      alert('تنظیمات با موفقیت ذخیره شد');
      refreshSettings();
    } catch (e) {
      alert('خطا در ذخیره تنظیمات');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('⚠️ اخطار: آیا از پاک کردن تمام اطلاعات (درخواست‌ها، تاریخچه و ...) اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
      try {
        await api.post('/reset');
        alert('تمام اطلاعات سیستم با موفقیت پاک شد.');
        window.location.reload();
      } catch (e) {
        alert('خطا در پاک کردن اطلاعات');
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

  return (
    <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-4">
        <h3 className="font-bold text-foreground text-base lg:text-lg">تنظیمات سامانه</h3>
        
        <div className="flex bg-secondary/30 rounded-lg p-1 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeTab === 'general' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Settings2 size={16} />
            عمومی
          </button>
          <button 
            onClick={() => setActiveTab('sms_settings')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeTab === 'sms_settings' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Wallet size={16} />
            تنظیمات پیامک
          </button>
          <button 
            onClick={() => setActiveTab('sms_templates')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeTab === 'sms_templates' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FileText size={16} />
            قالب‌ها
          </button>
          <button 
            onClick={() => setActiveTab('sms_logs')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeTab === 'sms_logs' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Activity size={16} />
            گزارش پیامک
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[400px]">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">نام سامانه (پروژه)</label>
              <input 
                type="text" 
                value={formData.projectName || ''} 
                onChange={e => setFormData({...formData, projectName: e.target.value})} 
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">نام شرکت</label>
              <input 
                type="text" 
                value={formData.companyName || ''} 
                onChange={e => setFormData({...formData, companyName: e.target.value})} 
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">لوگوی سامانه (اختیاری)</label>
              <div className="flex items-center gap-4">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-border p-1 bg-white" />
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-secondary/50">بدون لوگو</div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {formData.logoUrl && (
                  <button onClick={() => setFormData({...formData, logoUrl: ''})} className="text-xs text-destructive hover:underline">حذف لوگو</button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between">
              <button onClick={handleResetData} className="bg-destructive/10 hover:bg-destructive text-destructive hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                🗑️ پاکسازی کل اطلاعات
              </button>
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                <Save size={18} /> ذخیره تنظیمات
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sms_settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-xl">
              <div>
                <h4 className="font-bold text-primary mb-1">اعتبار حساب پیامک</h4>
                <p className="text-sm text-muted-foreground">موجودی پنل شما در SMS.ir</p>
              </div>
              <div className="text-left">
                {smsCredit !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{smsCredit.toLocaleString('fa-IR')}</span>
                    <span className="text-sm text-muted-foreground">پیامک</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">در حال بررسی...</span>
                )}
                <button onClick={fetchCredit} className="text-xs text-primary hover:underline mt-1">به‌روزرسانی</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="font-bold text-foreground">تنظیمات اصلی پیامک</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-semibold">فعال‌سازی ارسال پیامک</span>
                <input 
                  type="checkbox" 
                  checked={formData.smsEnabled || false} 
                  onChange={e => setFormData({...formData, smsEnabled: e.target.checked})}
                  className="w-4 h-4 accent-primary"
                />
              </label>
            </div>
            
            <div className={`space-y-4 ${!formData.smsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-foreground">API Key (SMS.ir)</label>
                  <input 
                    type="text" 
                    value={formData.smsApiKey || ''} 
                    onChange={e => setFormData({...formData, smsApiKey: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-left font-mono"
                    dir="ltr"
                    placeholder="LzBMfwWGgOz0ugQH..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-foreground">شماره خط اختصاصی</label>
                  <input 
                    type="text" 
                    value={formData.smsLineNumber || ''} 
                    onChange={e => setFormData({...formData, smsLineNumber: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-left font-mono"
                    dir="ltr"
                    placeholder="3000..."
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <label className="block text-sm font-bold mb-3 text-foreground">ارسال پیامک برای نقش‌های زیر فعال باشد:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-secondary/20 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <input type="checkbox" checked={formData.smsNotifyRequester !== false} onChange={e => setFormData({...formData, smsNotifyRequester: e.target.checked})} className="accent-primary w-4 h-4" />
                    <span className="text-sm font-semibold">درخواست‌کننده</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-secondary/20 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <input type="checkbox" checked={formData.smsNotifySupervisor !== false} onChange={e => setFormData({...formData, smsNotifySupervisor: e.target.checked})} className="accent-primary w-4 h-4" />
                    <span className="text-sm font-semibold">سرپرست</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-secondary/20 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <input type="checkbox" checked={formData.smsNotifyStorekeeper !== false} onChange={e => setFormData({...formData, smsNotifyStorekeeper: e.target.checked})} className="accent-primary w-4 h-4" />
                    <span className="text-sm font-semibold">انباردار</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-secondary/20 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <input type="checkbox" checked={formData.smsNotifyPurchaser !== false} onChange={e => setFormData({...formData, smsNotifyPurchaser: e.target.checked})} className="accent-primary w-4 h-4" />
                    <span className="text-sm font-semibold">مامور خرید</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                <Save size={18} /> ذخیره تنظیمات
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sms_templates' && (
          <div className="space-y-6">
            <div className="bg-blue-50/50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm leading-relaxed">
              <span className="font-bold block mb-1">راهنمای متغیرها:</span>
              می‌توانید از متغیرهای <code className="bg-white px-1 py-0.5 rounded text-xs font-mono">{"{{id}}"}</code> (شماره درخواست) و <code className="bg-white px-1 py-0.5 rounded text-xs font-mono">{"{{user}}"}</code> (نام کاربر) در متن پیامک‌ها استفاده کنید.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'req_submitted_requester', label: 'ثبت درخواست (برای درخواست‌کننده)' },
                { key: 'req_submitted_supervisor', label: 'ثبت درخواست (برای سرپرست)' },
                { key: 'req_approved_requester', label: 'تایید سرپرست (برای درخواست‌کننده)' },
                { key: 'req_approved_storekeeper', label: 'تایید سرپرست (برای انباردار)' },
                { key: 'req_rejected_requester', label: 'رد درخواست (برای درخواست‌کننده)' },
                { key: 'req_shortage_purchaser', label: 'کسری انبار (برای مامور خرید)' },
                { key: 'req_wh_supplied_requester', label: 'آماده تحویل از انبار (برای درخواست‌کننده)' },
                { key: 'req_delivered_requester', label: 'تحویل کالا (برای درخواست‌کننده)' },
                { key: 'req_purchased_supervisor', label: 'خرید کالا (برای سرپرست)' },
                { key: 'req_purchased_requester', label: 'خرید کالا (برای درخواست‌کننده)' },
              ].map(tpl => (
                <div key={tpl.key}>
                  <label className="block text-xs font-bold mb-2 text-foreground">{tpl.label}</label>
                  <textarea 
                    value={formData.smsTemplates?.[tpl.key] || ''}
                    onChange={(e) => handleTemplateChange(tpl.key, e.target.value)}
                    className="w-full h-20 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                <Save size={18} /> ذخیره قالب‌ها
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sms_logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-foreground">گزارش ارسال پیامک</h4>
              <button onClick={fetchLogs} className="text-xs bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
                به‌روزرسانی
              </button>
            </div>
            
            {smsLogs.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                هیچ گزارشی یافت نشد.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {smsLogs.map((log) => (
                  <div key={log.id} className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {log.status === 'success' ? 'موفق' : 'ناموفق'}
                        </span>
                        <span className="text-xs text-muted-foreground">{log.date}</span>
                        <span className="text-xs font-mono text-foreground dir-ltr">{log.mobiles}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{log.message}</p>
                      {log.error && (
                        <p className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded inline-block mt-1">
                          خطا: {log.error}
                        </p>
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
