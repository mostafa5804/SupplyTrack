import React, { useEffect, useState } from 'react';
import { api } from '../lib/utils';
import { useAuth } from '../store/AuthContext';
import { Plus, X, Trash2, Edit2, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const { user: currentUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    username: '',
    password: '',
    role: 'requester',
    department: '',
    mobile: ''
  });

  // Custom toast notification state
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = () => {
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.username.trim() || !formData.role) {
      showNotification('لطفاً تمامی فیلدهای ضروری ستاره‌دار را پر کنید.', 'error');
      return;
    }
    
    let submitData = { ...formData };
    if (submitData.mobile) {
      // Remove spaces, dashes and other decorative characters
      submitData.mobile = submitData.mobile.replace(/[\s\-\(\)]/g, '');
      
      // Strict regex checking: must start with 09 or +989 or 989 followed by 9 digits
      const phoneRegex = /^(09|\+989|989)\d{9}$/;
      if (!phoneRegex.test(submitData.mobile)) {
        showNotification('فرمت شماره موبایل نادرست است. باید با 09 یا پیش‌شماره 98+ آغاز شود.', 'error');
        return;
      }

      // Convert "989..." to "+989..." for uniform database storage
      if (submitData.mobile.startsWith('989')) {
        submitData.mobile = '+' + submitData.mobile;
      }
    }
    
    try {
      if (submitData.id) {
        await api.put(`/users/${submitData.id}`, submitData);
        showNotification('اطلاعات کاربر با موفقیت ویرایش شد.', 'success');
      } else {
        await api.post('/users', submitData);
        showNotification('کاربر جدید با موفقیت ایجاد و ثبت شد.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e: any) {
      showNotification(e.response?.data?.message || 'خطا در ذخیره‌سازی اطلاعات کاربر.', 'error');
    }
  };

  const handleEdit = (u: any) => {
    setFormData({ ...u, password: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('⚠️ آیا از حذف این کاربر اطمینان دارید؟ اطلاعات وی غیرقابل بازیابی خواهد بود.')) {
      try {
        await api.delete(`/users/${id}`);
        showNotification('کاربر مورد نظر با موفقیت حذف شد.', 'success');
        fetchData();
      } catch (e) {
        showNotification('خطا در حذف کاربر از دیتابیس.', 'error');
      }
    }
  };

  const roleLabels: any = {
    admin: 'ادمین سیستم',
    requester: 'درخواست‌کننده',
    supervisor: 'سرپرست بخش',
    storekeeper: 'مسئول انبار',
    purchaser: 'مسئول تدارکات / خرید'
  };

  if (currentUser?.role !== 'admin') {
    return <div className="text-center p-12 text-destructive font-bold text-lg">شما دسترسی به این بخش را ندارید.</div>;
  }

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
                {toast.type === 'success' ? 'عملیات موفق' : toast.type === 'error' ? 'توجه فرمایید' : 'اطلاعیه'}
              </p>
              <p className="text-xs mt-0.5 leading-relaxed font-semibold">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-bold text-foreground text-lg lg:text-xl">مدیریت کاربران سامانه</h3>
          <p className="text-xs text-muted-foreground mt-1">تعریف پرسنل، انتساب نقش‌ها، اطلاعات تماس جهت دریافت نوتیفیکیشن پیامکی کالا</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ id: 0, name: '', username: '', password: '', role: 'requester', department: '', mobile: '' });
            setIsModalOpen(true);
          }}
          className="text-xs lg:text-sm font-bold px-4 py-2 bg-primary hover:bg-blue-600 text-primary-foreground rounded-xl shadow-sm flex items-center gap-1.5 lg:gap-2 transition-all"
        >
          <Plus size={16} /> ثبت کاربر جدید
        </button>
      </div>

      {/* Main Table Card */}
      <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-right border-collapse">
              <thead className="bg-muted sticky top-0 border-b border-border z-10">
                <tr className="text-muted-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5 whitespace-nowrap">نام و نام خانوادگی</th>
                  <th className="px-6 py-3.5 whitespace-nowrap hidden sm:table-cell">نام کاربری</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">شماره همراه اطلاع‌رسانی</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">نقش سازمانی</th>
                  <th className="px-6 py-3.5 whitespace-nowrap hidden md:table-cell">بخش / دپارتمان</th>
                  <th className="px-6 py-3.5 whitespace-nowrap text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">{u.name}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground whitespace-nowrap hidden sm:table-cell">{u.username}</td>
                    <td className="px-6 py-4 font-mono text-foreground font-bold whitespace-nowrap dir-ltr text-right">
                      {u.mobile ? (
                        <span className="bg-secondary/40 px-2.5 py-1 rounded-lg border border-border/50 text-slate-800">{u.mobile}</span>
                      ) : (
                        <span className="text-muted-foreground font-normal text-[11px]">ثبت نشده ⚠️</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] lg:text-[11px] font-bold inline-block border", 
                        u.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        u.role === 'supervisor' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        u.role === 'storekeeper' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        u.role === 'purchaser' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      )}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell font-bold text-muted-foreground">{u.department || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(u)} className="text-primary hover:bg-primary/10 p-2 rounded-xl transition-all" title="ویرایش"><Edit2 size={15} /></button>
                        {u.id !== currentUser.id && (
                          <button onClick={() => handleDelete(u.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all" title="حذف"><Trash2 size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col divide-y divide-border">
            {users.map(u => (
              <div key={u.id} className="p-4 flex flex-col gap-3 bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-foreground mb-0.5">{u.name}</div>
                    <div className="font-mono text-muted-foreground text-[11px]">نام کاربری: {u.username}</div>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-bold border", 
                    u.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                    u.role === 'supervisor' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    u.role === 'storekeeper' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    u.role === 'purchaser' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  )}>
                    {roleLabels[u.role] || u.role}
                  </span>
                </div>
                
                <div className="bg-muted/10 p-3 rounded-xl border border-border/40 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">شماره همراه:</span>
                    <span className="font-mono font-bold text-foreground dir-ltr">{u.mobile || 'ثبت نشده ⚠️'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">دپارتمان:</span>
                    <span className="font-bold text-foreground">{u.department || '—'}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-border/30">
                  <button onClick={() => handleEdit(u)} className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-[11px] px-3 py-1.5 rounded-lg transition-all font-bold">
                    <Edit2 size={12} /> ویرایش
                  </button>
                  {u.id !== currentUser.id && (
                    <button onClick={() => handleDelete(u.id)} className="flex items-center gap-1 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-[11px] px-3 py-1.5 rounded-lg transition-all font-bold">
                      <Trash2 size={12} /> حذف کاربر
                    </button>
                  )}
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="py-16 text-center text-muted-foreground text-sm">هیچ کاربری در سامانه یافت نشد.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="font-bold text-foreground text-base lg:text-lg">{formData.id ? '✏️ ویرایش مشخصات کاربر' : '👤 ایجاد کاربر سازمانی جدید'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-xl transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">نام و نام خانوادگی <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary font-semibold" 
                  placeholder="مثال: علیرضا حسینی"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">نام کاربری (جهت ورود به سیستم) <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary text-left font-mono" 
                  dir="ltr"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">
                  رمز عبور {formData.id ? <span className="text-muted-foreground font-normal">(در صورت عدم تمایل به تغییر، خالی بگذارید)</span> : <span className="text-rose-500">*</span>}
                </label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary text-left font-mono" 
                  dir="ltr"
                  placeholder={formData.id ? "••••••••" : "رمز ورود"}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-muted-foreground">
                  شماره تلفن همراه (جهت ارسال پیامک رویدادها)
                </label>
                <div className="text-[10px] text-amber-700 bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg mb-2 leading-relaxed">
                  <strong>⚠️ راهنمای قالب شماره همراه:</strong> <br />
                  ۱. با <strong>09</strong> شروع شود (مانند <span className="font-mono font-bold">09123456789</span>) <br />
                  ۲. یا با کد کشور <strong>98+</strong> شروع شود (مانند <span className="font-mono font-bold">+989123456789</span>)
                </div>
                <input 
                  type="text" 
                  value={formData.mobile || ''} 
                  onChange={e => setFormData({...formData, mobile: e.target.value})} 
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary text-left font-mono font-bold" 
                  dir="ltr" 
                  placeholder="09123456789" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">نقش سازمانی <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary font-bold"
                >
                  {Object.entries(roleLabels).map(([val, label]: any) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">بخش / دپارتمان تابعه</label>
                <input 
                  type="text" 
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})} 
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary font-semibold" 
                  placeholder="مانند: تولید، دفتر فنی، انبار اصلی"
                />
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-transparent border border-border hover:border-foreground/30 px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-muted-foreground"
              >
                انصراف
              </button>
              <button 
                onClick={handleSubmit} 
                className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all shadow-xs"
              >
                ذخیره مشخصات کاربر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
