import React, { useEffect, useState } from 'react';
import { api } from '../lib/utils';
import { useAuth } from '../store/AuthContext';
import { Plus, X, Trash2, Edit2, Shield } from 'lucide-react';
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

  const fetchData = () => {
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.username || !formData.role) return alert('لطفا فیلدهای ضروری را پر کنید');
    
    let submitData = { ...formData };
    if (submitData.mobile) {
      submitData.mobile = submitData.mobile.replace(/\s/g, '');
      if (!/^(09|\+989)\d{9}$/.test(submitData.mobile)) {
        return alert('شماره موبایل نامعتبر است. فرمت صحیح: 09123456789 یا 989123456789+');
      }
    }
    
    try {
      if (submitData.id) {
        await api.put(`/users/${submitData.id}`, submitData);
      } else {
        await api.post('/users', submitData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'خطا در ثبت کاربر');
    }
  };

  const handleEdit = (u: any) => {
    setFormData({ ...u, password: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      try {
        await api.delete(`/users/${id}`);
        fetchData();
      } catch (e) {
        alert('خطا در حذف کاربر');
      }
    }
  };

  const roleLabels: any = {
    admin: 'ادمین',
    requester: 'درخواست‌کننده',
    supervisor: 'سرپرست',
    storekeeper: 'انباردار',
    purchaser: 'مامور خرید'
  };

  if (currentUser?.role !== 'admin') {
    return <div className="text-center p-12 text-destructive font-bold text-lg">شما دسترسی به این بخش را ندارید.</div>;
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 max-w-full">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="font-bold text-foreground text-base lg:text-lg">مدیریت کاربران</h3>
        <button 
          onClick={() => {
            setFormData({ id: 0, name: '', username: '', password: '', role: 'requester', department: '',
    mobile: '' });
            setIsModalOpen(true);
          }}
          className="text-xs font-bold px-3 py-1.5 lg:px-4 lg:py-2 bg-primary text-primary-foreground rounded-lg shadow-sm flex items-center gap-1.5 lg:gap-2"
        >
          <Plus size={16} /> کاربر جدید
        </button>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-right border-collapse">
              <thead className="bg-muted sticky top-0 border-b border-border z-10">
                <tr className="text-muted-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">نام و نام خانوادگی</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap hidden sm:table-cell">نام کاربری</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">شماره موبایل</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">نقش</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap hidden md:table-cell">دپارتمان</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 font-bold whitespace-nowrap">{u.name}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 font-mono text-muted-foreground whitespace-nowrap hidden sm:table-cell">{u.username}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 font-mono text-muted-foreground whitespace-nowrap">{u.mobile || '—'}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 whitespace-nowrap">
                      <span className={cn("px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[11px] font-bold inline-block", u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground')}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 whitespace-nowrap hidden md:table-cell">{u.department || '—'}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={() => handleEdit(u)} className="text-primary hover:bg-primary/10 p-1 sm:p-1.5 rounded-lg transition-colors"><Edit2 size={16} /></button>
                        {u.id !== currentUser.id && (
                          <button onClick={() => handleDelete(u.id)} className="text-destructive hover:bg-destructive/10 p-1 sm:p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
              <div key={u.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-foreground mb-1">{u.name}</div>
                    <div className="font-mono text-muted-foreground text-xs">{u.username}</div>
                  </div>
                  <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold shrink-0", u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground')}>
                    {roleLabels[u.role] || u.role}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <div className="text-muted-foreground">
                    دپارتمان: <strong className="text-foreground">{u.department || '—'}</strong>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(u)} className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground p-1.5 rounded-md transition-colors"><Edit2 size={14} /></button>
                    {u.id !== currentUser.id && (
                      <button onClick={() => handleDelete(u.id)} className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground p-1.5 rounded-md transition-colors"><Trash2 size={14} /></button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">کاربری یافت نشد.</div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border shrink-0">
              <h3 className="font-bold text-base lg:text-lg">{formData.id ? 'ویرایش کاربر' : 'کاربر جدید'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-4 lg:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold mb-1.5">نام و نام خانوادگی</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              
              <div>
                <label className="block text-xs font-bold mb-1.5">نام کاربری</label>
                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-left" dir="ltr" />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">رمز عبور {formData.id && <span className="text-muted-foreground font-normal">(در صورت عدم تغییر خالی بگذارید)</span>}</label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-left" dir="ltr" />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">شماره موبایل <span className="text-muted-foreground font-normal text-[10px]">(09 یا 98+)</span></label>
                <input type="text" value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-left" dir="ltr" placeholder="09123456789" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">نقش</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
                  {Object.entries(roleLabels).map(([val, label]: any) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">دپارتمان (اختیاری)</label>
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
            </div>

            <div className="p-4 lg:p-6 border-t border-border flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="bg-transparent border border-border hover:border-primary hover:text-primary px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors">انصراف</button>
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors">ثبت کاربر</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
