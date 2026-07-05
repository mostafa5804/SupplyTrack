import React, { useEffect, useState } from 'react';
import { api, farsiNum } from '../lib/utils';
import { QtyInput } from '../components/QtyInput';
import { Request } from '../types';
import { RequestDetailsModal } from '../components/RequestDetailsModal';
import { Printer, Check, X } from 'lucide-react';

export function Supervisor() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchData = () => {
    api.get('/requests').then(res => {
      const data = res.data.filter((r: Request) => r.status === 'pending_supervisor');
      data.forEach((r: Request) => r.items.forEach(it => {
        if (it.supQty === 0 && it.reqQty > 0 && !it.hasOwnProperty('_initialized')) {
          it.supQty = it.reqQty;
          (it as any)._initialized = true;
        }
      }));
      setRequests(data);
    });
    api.get('/users').then(res => setUsers(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (r: Request) => {
    try {
      // Map to ensure any empty strings become 0
      const itemsToSubmit = r.items.map(it => ({
        ...it,
        supQty: typeof it.supQty === 'string' && it.supQty === '' ? 0 : Number(it.supQty)
      }));
      
      await api.put(`/requests/${r.id}/supervisor`, {
        action: 'approve',
        items: itemsToSubmit,
        comment: (document.getElementById(`comment-${r.id}`) as HTMLInputElement)?.value
      });
      fetchData();
    } catch (e) {
      alert('خطا در تأیید درخواست');
    }
  };

  const handleReject = async (r: Request) => {
    try {
      await api.put(`/requests/${r.id}/supervisor`, {
        action: 'reject',
        comment: (document.getElementById(`comment-${r.id}`) as HTMLInputElement)?.value
      });
      fetchData();
    } catch (e) {
      alert('خطا در رد درخواست');
    }
  };

  const handleQtyChange = (reqId: number, itemIdx: number, val: any, maxQty: number) => {
    const newReqs = [...requests];
    const req = newReqs.find(r => r.id === reqId);
    if (req) {
      if (val === '') {
        req.items[itemIdx].supQty = '' as any;
      } else {
        const numVal = parseInt(val, 10);
        req.items[itemIdx].supQty = isNaN(numVal) ? 0 : numVal;
      }
      setRequests(newReqs);
    }
  };

  const handleItemAction = (reqId: number, itemIdx: number, action: 'approve' | 'reject', maxQty: number) => {
    const newReqs = [...requests];
    const req = newReqs.find(r => r.id === reqId);
    if (req) {
      req.items[itemIdx].supQty = action === 'approve' ? maxQty : 0;
      setRequests(newReqs);
    }
  };

  const handleItemComment = (reqId: number, itemIdx: number, val: string) => {
    const newReqs = [...requests];
    const req = newReqs.find(r => r.id === reqId);
    if (req) {
      req.items[itemIdx].supComment = val;
      setRequests(newReqs);
    }
  };

  const openDetails = (r: Request) => {
    setSelectedReq(r);
    setIsDetailOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6 w-full">
      <div className="flex justify-between items-center mb-4 lg:mb-6"><h3 className="text-lg lg:text-xl font-bold">درخواست‌های در انتظار تأیید سرپرست</h3><button onClick={() => window.print()} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 print:hidden">🖨️ چاپ</button></div>

      {requests.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 lg:p-12 text-center text-muted-foreground shadow-sm">
          <div className="text-3xl lg:text-4xl mb-4 opacity-50">✅</div>
          <p className="text-sm lg:text-base">درخواستی برای تأیید وجود ندارد</p>
        </div>
      ) : (
        requests.map(r => {
          const u = users.find(u => u.id === r.requesterId);
          return (
            <div key={r.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-muted px-4 lg:px-6 py-3 lg:py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-sm">درخواست REQ-{farsiNum(r.id)}</h3>
                  <span className="text-xs text-muted-foreground">{u?.name} — {r.date}</span>
                </div>
                <button onClick={() => openDetails(r)} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  <Printer size={14} /> چاپ / جزئیات
                </button>
              </div>
              <div className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-6 whitespace-nowrap">نام کالا</th>
                        <th className="py-3 px-6 text-center whitespace-nowrap">درخواستی</th>
                        <th className="py-3 px-6 text-center whitespace-nowrap">تأییدی</th>
                        <th className="py-3 px-6 text-center whitespace-nowrap">عملیات ردیف</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-border">
                      {r.items.map((it, idx) => {
                        return (
                          <tr key={idx} className="hover:bg-accent/30 transition-colors">
                            <td className="py-3 px-6">
                              <div className="font-medium text-foreground">{it.itemName}</div>
                              {it.description && <div className="text-muted-foreground text-[10px] mt-1 break-words max-w-xs">{it.description}</div>}
                            </td>
                            <td className="py-3 px-6 text-center font-bold whitespace-nowrap">{farsiNum(it.reqQty)} <span className="text-muted-foreground text-[10px] font-normal">{it.unit}</span></td>
                            <td className="py-3 px-6 text-center whitespace-nowrap">
                              <QtyInput 
                                min={0} 
                                value={it.supQty}
                                onChange={(val) => handleQtyChange(r.id, idx, val, it.reqQty)}
                                className="w-auto inline-flex"
                              />
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="flex flex-col gap-1.5 w-full max-w-[200px] mx-auto">
                                <div className="flex justify-center gap-1">
                                  <button onClick={() => handleItemAction(r.id, idx, 'approve', it.reqQty)} className={`p-1.5 rounded-md border ${it.supQty > 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:bg-secondary text-muted-foreground'} transition-colors`} title="تأیید کامل">
                                    <Check size={16} />
                                  </button>
                                  <button onClick={() => handleItemAction(r.id, idx, 'reject', it.reqQty)} className={`p-1.5 rounded-md border ${it.supQty === 0 ? 'bg-destructive/10 border-destructive text-destructive' : 'bg-background border-border hover:bg-secondary text-muted-foreground'} transition-colors`} title="رد / حذف">
                                    <X size={16} />
                                  </button>
                                </div>
                                <input 
                                  type="text"
                                  value={it.supComment || ''}
                                  onChange={(e) => handleItemComment(r.id, idx, e.target.value)}
                                  placeholder="توضیحات این ردیف"
                                  className="w-full bg-background border border-border rounded-md px-1.5 py-1 text-[10px] outline-none focus:ring-1 focus:ring-primary text-center"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col divide-y divide-border">
                  {r.items.map((it, idx) => (
                    <div key={idx} className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-foreground">{it.itemName}</div>
                          {it.description && <div className="text-muted-foreground text-[10px] mt-1 break-words">{it.description}</div>}
                        </div>
                        <div className="text-left shrink-0">
                          <div className="text-[9px] text-muted-foreground mb-1">درخواست</div>
                          <div className="font-bold">{farsiNum(it.reqQty)} <span className="text-[9px] font-normal">{it.unit}</span></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold">مقدار تأییدی:</span>
                          <div className="flex items-center gap-2">
                            <QtyInput 
                              min={0} 
                              value={it.supQty}
                              onChange={(val) => handleQtyChange(r.id, idx, val, it.reqQty)}
                            />
                            <div className="flex gap-1">
                              <button onClick={() => handleItemAction(r.id, idx, 'approve', it.reqQty)} className={`p-1 rounded-md border ${it.supQty > 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:bg-secondary text-muted-foreground'}`}><Check size={16} /></button>
                              <button onClick={() => handleItemAction(r.id, idx, 'reject', it.reqQty)} className={`p-1 rounded-md border ${it.supQty === 0 ? 'bg-destructive/10 border-destructive text-destructive' : 'bg-background border-border hover:bg-secondary text-muted-foreground'}`}><X size={16} /></button>
                            </div>
                          </div>
                        </div>
                        <input 
                          type="text"
                          value={it.supComment || ''}
                          onChange={(e) => handleItemComment(r.id, idx, e.target.value)}
                          placeholder="توضیحات سرپرست برای این ردیف"
                          className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-[10px] outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 lg:p-6 border-t border-border bg-card">
                  <label className="block text-xs font-bold text-muted-foreground mb-2">توضیحات سرپرست (اختیاری)</label>
                  <textarea 
                    id={`comment-${r.id}`}
                    placeholder="دلیل کاهش مقدار یا نکات فنی..."
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary min-h-[60px]"
                  ></textarea>

                  <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-4 sticky bottom-0 bg-card p-4 -mx-4 -mb-4 sm:mx-0 sm:mb-0 sm:p-0 sm:static sm:bg-transparent border-t border-border sm:border-0 z-10">
                    <button onClick={() => handleApprove(r)} className="w-full sm:w-auto justify-center flex items-center bg-primary hover:bg-blue-600 text-white px-4 py-2.5 lg:py-2 rounded-lg text-xs font-bold transition-colors">
                      <Check size={16} className="ml-1" /> تأیید درخواست
                    </button>
                    <button onClick={() => handleReject(r)} className="w-full sm:w-auto justify-center flex items-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white px-4 py-2.5 lg:py-2 rounded-lg text-xs font-bold transition-colors">
                      <X size={16} className="ml-1" /> رد درخواست
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      
      {isDetailOpen && selectedReq && (
        <RequestDetailsModal request={selectedReq} onClose={() => setIsDetailOpen(false)} />
      )}
    </div>
  );
}
