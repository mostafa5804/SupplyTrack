import React, { useEffect, useState, useMemo } from 'react';
import { api, STATUS_MAP, farsiNum } from '../lib/utils';
import { Request } from '../types';
import { cn } from '../lib/utils';
import { Plus, X, Trash2, Edit2, Search, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { RequestDetailsModal } from '../components/RequestDetailsModal';

export function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [newReqItems, setNewReqItems] = useState([{ id: 0, itemName: '', unit: '', qty: 1, description: '' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const fetchData = () => {
    api.get('/requests').then(res => setRequests(res.data));
    api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchData();
    if (location.state?.openNew) {
      setSelectedReq(null);
      setNewReqItems([{ id: 0, itemName: '', unit: '', qty: 1, description: '' }]);
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleSubmit = async () => {
    const validItems = newReqItems.filter(i => i.itemName.trim() !== '' && i.unit.trim() !== '' && i.qty > 0);
    if (validItems.length === 0) return alert('حداقل یک کالای معتبر وارد کنید');
    
    try {
      if (selectedReq) {
        await api.put(`/requests/${selectedReq.id}`, { items: validItems.map(i => ({ id: i.id, itemName: i.itemName, unit: i.unit, qty: i.qty, description: i.description })) });
      } else {
        await api.post('/requests', { items: validItems.map(i => ({ itemName: i.itemName, unit: i.unit, qty: i.qty, description: i.description })) });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      alert('خطا در ثبت درخواست');
    }
  };

  const handleDelete = async (r: Request) => {
    if (confirm('آیا از حذف این درخواست اطمینان دارید؟')) {
      try {
        await api.delete(`/requests/${r.id}`);
        fetchData();
      } catch (e) {
        alert('خطا در حذف درخواست');
      }
    }
  };

  const openDetails = (r: Request) => {
    setSelectedReq(r);
    setIsDetailOpen(true);
  };

  const openEdit = (r: Request) => {
    setSelectedReq(r);
    setNewReqItems(r.items.map(it => ({ id: it.id, itemName: it.itemName, unit: it.unit, qty: it.reqQty, description: it.description || '' })));
    setIsModalOpen(true);
  };

  const filteredAndSortedRequests = useMemo(() => {
    let result = [...requests];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => {
        const reqUser = users.find(u => u.id === r.requesterId);
        const reqName = reqUser?.name?.toLowerCase() || '';
        const reqId = `req-${r.id}`;
        return reqId.includes(q) || reqName.includes(q) || r.date.includes(q);
      });
    }

    result.sort((a, b) => {
      if (sortOrder === 'desc') return b.id - a.id;
      return a.id - b.id;
    });

    return result;
  }, [requests, searchQuery, sortOrder, users]);

  const handleExportCSV = () => {
    let csv = '\uFEFF' + 'شناسه درخواست,درخواست دهنده,تاریخ ثبت,تعداد اقلام,وضعیت فرآیند\n';
    filteredAndSortedRequests.forEach(r => {
      const s = STATUS_MAP[r.status];
      const reqUser = users.find(u => u.id === r.requesterId);
      const reqName = reqUser?.name || 'نامشخص';
      csv += `REQ-${r.id},${reqName},${r.date},${farsiNum(r.items.length)},${s?.label}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `لیست_درخواست_ها_${farsiNum(new Intl.DateTimeFormat('fa-IR', { numberingSystem: 'arabext' }).format(new Date()))}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-4">
        <h3 className="font-bold text-foreground text-base lg:text-lg">لیست درخواست‌ها</h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="جستجو در شناسه، تاریخ، شخص..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pr-10 pl-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <button onClick={handleExportCSV} className="w-full sm:w-auto justify-center text-xs font-bold px-3 py-2 lg:px-4 lg:py-2 border border-border rounded-lg hover:bg-secondary transition-colors whitespace-nowrap">
            خروجی اکسل / CSV
          </button>
          
          {true && (
            <button 
              onClick={() => {
                setSelectedReq(null);
                setNewReqItems([{ id: 0, itemName: '', unit: '', qty: 1, description: '' }]);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto justify-center text-xs font-bold px-3 py-2 lg:px-4 lg:py-2 bg-primary text-primary-foreground rounded-lg shadow-sm flex items-center gap-1.5 lg:gap-2"
            >
              <Plus size={16} /> ثبت درخواست جدید
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-right border-collapse">
              <thead className="bg-muted sticky top-0 border-b border-border z-10">
                <tr className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}>
                    <div className="flex items-center gap-1">شناسه <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-3 whitespace-nowrap">درخواست دهنده</th>
                  <th className="px-6 py-3 whitespace-nowrap">تاریخ ثبت</th>
                  <th className="px-6 py-3 text-center whitespace-nowrap">تعداد اقلام</th>
                  <th className="px-6 py-3 whitespace-nowrap">وضعیت فرآیند</th>
                  <th className="px-6 py-3 whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-border">
                {filteredAndSortedRequests.map(r => {
                  const s = STATUS_MAP[r.status];
                  const reqUser = users.find(u => u.id === r.requesterId);
                  return (
                    <tr key={r.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-muted-foreground font-bold whitespace-nowrap">REQ-{farsiNum(r.id)}</td>
                      <td className="px-6 py-3.5 font-bold whitespace-nowrap">{reqUser?.name || 'نامشخص'}</td>
                      <td className="px-6 py-3.5 font-medium whitespace-nowrap">{r.date}</td>
                      <td className="px-6 py-3.5 text-center font-bold whitespace-nowrap">{farsiNum(r.items.length)} ردیف</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold inline-block", s?.cls)}>
                          {s?.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
    <button onClick={() => openDetails(r)} className="text-primary hover:underline font-bold text-[11px] sm:text-xs">مشاهده</button>
    {r.status === 'pending_supervisor' && (r.requesterId === user?.id || user?.role === 'admin') && (
      <>
        <button onClick={() => openEdit(r)} className="text-muted-foreground hover:text-primary transition-colors" title="ویرایش"><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(r)} className="text-muted-foreground hover:text-destructive transition-colors" title="حذف"><Trash2 size={16} /></button>
      </>
    )}
  </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredAndSortedRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">درخواستی یافت نشد.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col divide-y divide-border">
            {filteredAndSortedRequests.map(r => {
              const s = STATUS_MAP[r.status];
              const reqUser = users.find(u => u.id === r.requesterId);
              return (
                <div key={r.id} className="p-4 flex flex-col gap-3 hover:bg-accent/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-muted-foreground font-bold text-xs mb-1">REQ-{farsiNum(r.id)}</div>
                      <div className="font-bold text-sm text-foreground">{reqUser?.name || 'نامشخص'}</div>
                    </div>
                    <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold shrink-0", s?.cls)}>
                      {s?.label}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex gap-4">
                      <span>تاریخ: <strong className="text-foreground">{r.date}</strong></span>
                      <span>اقلام: <strong className="text-foreground">{farsiNum(r.items.length)}</strong></span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-border/50">
    <button onClick={() => openDetails(r)} className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-xs font-bold transition-colors">مشاهده</button>
    {r.status === 'pending_supervisor' && (r.requesterId === user?.id || user?.role === 'admin') && (
      <>
        <button onClick={() => openEdit(r)} className="flex-1 border border-border hover:bg-muted text-muted-foreground flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors"><Edit2 size={14} /> ویرایش</button>
        <button onClick={() => handleDelete(r)} className="flex-1 border border-destructive/20 hover:bg-destructive/10 text-destructive flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors"><Trash2 size={14} /> حذف</button>
      </>
    )}
  </div>
                </div>
              );
            })}
            {filteredAndSortedRequests.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">درخواستی یافت نشد.</div>
            )}
          </div>
        </div>
      </div>

      {/* New/Edit Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 lg:p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border shrink-0">
              <h3 className="font-bold text-base lg:text-lg">{selectedReq ? `ویرایش درخواست REQ-${selectedReq.id}` : 'ثبت درخواست جدید'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-4 lg:p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <label className="font-semibold text-sm">اقلام درخواستی</label>
                <button 
                  onClick={() => setNewReqItems([...newReqItems, { id: 0, itemName: '', unit: '', qty: 1, description: '' }])}
                  className="text-primary text-sm font-semibold hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus size={16} /> افزودن ردیف
                </button>
              </div>

              <div className="space-y-3">
                {newReqItems.map((row, idx) => (
                  <div key={idx} className="flex flex-col gap-3 bg-secondary/50 p-4 rounded-xl border border-border/50">
                    <div className="flex flex-wrap items-center gap-3">
                      <input 
                        type="text"
                        placeholder="نام کالا (مثلا: پیچ متری)"
                        value={row.itemName}
                        onChange={(e) => {
                          const newArr = [...newReqItems];
                          newArr[idx].itemName = e.target.value;
                          setNewReqItems(newArr);
                        }}
                        className="flex-1 min-w-[200px] bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      
                      <input 
                        type="text"
                        placeholder="واحد (مثال: عدد)"
                        value={row.unit}
                        onChange={(e) => {
                          const newArr = [...newReqItems];
                          newArr[idx].unit = e.target.value;
                          setNewReqItems(newArr);
                        }}
                        className="w-32 bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-center"
                      />

                      <input 
                        type="number"
                        min="1"
                        placeholder="تعداد"
                        value={row.qty}
                        onChange={(e) => {
                          const newArr = [...newReqItems];
                          const val = e.target.value;
                          if (val === '') {
                            newArr[idx].qty = '' as any;
                          } else {
                            const parsed = parseInt(val, 10);
                            newArr[idx].qty = isNaN(parsed) ? 1 : parsed;
                          }
                          setNewReqItems(newArr);
                        }}
                        className="w-24 bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-center"
                      />
                      
                      <button 
                        onClick={() => {
                          const newArr = [...newReqItems];
                          newArr.splice(idx, 1);
                          setNewReqItems(newArr);
                        }}
                        disabled={newReqItems.length === 1}
                        className="text-destructive bg-destructive/10 hover:bg-destructive hover:text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <input 
                      type="text"
                      placeholder="توضیحات (اختیاری: مثلا محل مصرف، مشخصات فنی)"
                      value={row.description}
                      onChange={(e) => {
                        const newArr = [...newReqItems];
                        newArr[idx].description = e.target.value;
                        setNewReqItems(newArr);
                      }}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 lg:p-6 border-t border-border flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="bg-transparent border border-border hover:border-primary hover:text-primary px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors">انصراف</button>
              <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors">ثبت نهایی درخواست</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailOpen && selectedReq && (
        <RequestDetailsModal request={selectedReq} onClose={() => setIsDetailOpen(false)} />
      )}
    </div>
  );
}
