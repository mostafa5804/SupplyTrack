import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useSettings } from '../store/SettingsContext';
import { api } from '../lib/utils';
import { Save } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const { settings, refreshSettings } = useSettings();
  
  const [formData, setFormData] = useState({
    projectName: '',
    companyName: '',
    logoUrl: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (user?.role !== 'admin') {
    return <div className="text-center p-12 text-destructive font-bold text-lg">شما دسترسی به این بخش را ندارید.</div>;
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
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

  return (
    <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="font-bold text-foreground text-base lg:text-lg">تنظیمات سامانه</h3>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 text-foreground">نام سامانه (پروژه)</label>
          <input 
            type="text" 
            value={formData.projectName} 
            onChange={e => setFormData({...formData, projectName: e.target.value})} 
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-2 text-foreground">نام شرکت</label>
          <input 
            type="text" 
            value={formData.companyName} 
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
    </div>
  );
}
