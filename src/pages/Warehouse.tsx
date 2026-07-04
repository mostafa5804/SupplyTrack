import React, { useEffect, useState } from 'react';
import { api, farsiNum, STATUS_MAP } from '../lib/utils';
import { Request } from '../types';
import { Printer, PackageCheck, Package, ShoppingCart, Search, AlertTriangle } from 'lucide-react';
import { RequestDetailsModal } from '../components/RequestDetailsModal';
import { useToast } from '../components/ToastProvider';

export function Warehouse() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);

  const fetchData = () => {
    api.get('/requests').then(res => {
      const data = res.data.filter((r: Request) => ['approved_supervisor', 'warehouse_check', 'pending_delivery', 'partial_delivery'].includes(r.status));
      data.forEach((r: Request) => r.items.forEach(it => {
        if (it.whQty === 0 && it.supQty > 0 && !it.hasOwnProperty('_whInitialized')) {
          it.whQty = it.supQty;
          it.buyQty = 0;
          (it as any)._whInitialized = true;
        }
        if (it.deliveredQty === undefined) {
            it.deliveredQty = 0;
        }
      }));
      setRequests(data);
    });
    api.get('/users').then(res => setUsers(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQtyChange = (reqId: number, itemIdx: number, val: string, field: 'whQty' | 'deliveredQty') => {
    const newReqs = [...requests];
    const req = newReqs.find(r => r.id === reqId);
    if (req) {
      const item = req.items[itemIdx];
      const numVal = parseInt(val, 10);
      const parsed = isNaN(numVal) ? 0 : numVal;
      
      if (field === 'whQty') {
        if (val === '') {
          item.whQty = '' as any;
          item.buyQty = item.supQty;
        } else {
          const validWhQty = Math.min(Math.max(0, parsed), item.supQty);
          item.whQty = validWhQty;
          item.buyQty = item.supQty - validWhQty;
        }
      } else if (field === 'deliveredQty') {
        if (val === '') {
          item.deliveredQty = '' as any;
        } else {
          const maxDeliverable = (item.whQty || 0) + (item.purchasedQty || 0);
          item.deliveredQty = Math.min(Math.max(0, parsed), maxDeliverable);
        }
      }
      setRequests(newReqs);
    }
  };

  const handleConfirm = async (req: Request) => {
    try {
      await api.put(`/requests/${req.id}/warehouse`, { items: req.items });
      fetchData();
      alert('بررسی انبار با موفقیت ثبت شد.');
    } catch (e) {
      alert('خطا در ثبت');
    }
  };

  const handleDeliver = async (req: Request) => {
    try {
      await api.put(`/requests/${req.id}/deliver`, { items: req.items });
      fetchData();
      alert('تحویل با موفقیت ثبت شد.');
    } catch (e) {
      alert('خطا در ثبت');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 lg:space-y-8 w-full">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold">مدیریت انبار</h3>
        <div className="flex gap-2 print:hidden">
          <button onClick={() => window.print()} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            🖨️ چاپ
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 lg:p-12 text-center text-muted-foreground shadow-sm mb-8">
          <div className="text-3xl lg:text-4xl mb-4 opacity-50">📦</div>
          <p className="text-sm lg:text-base">درخواستی برای بررسی یا تحویل در انبار وجود ندارد</p>
        </div>
      ) : (
        requests.slice().reverse().map(r => {
          const u = users.find(u => u.id === r.requesterId);
          const isDeliveryMode = r.status === 'pending_delivery' || r.status === 'partial_delivery';
          
          return (
            <div key={r.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-4 lg:mb-8">
              <div className="bg-muted px-4 lg:px-6 py-3 lg:py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 print:hidden">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-sm">درخواست REQ-{farsiNum(r.id)}</h3>
                  <span className="text-xs text-muted-foreground">{u?.name} — {r.date}</span>
                  <span className={STATUS_MAP[r.status]?.cls + ' px-2 py-1 rounded-md text-[10px] font-bold'}>{STATUS_MAP[r.status]?.label}</span>
                </div>
                <button onClick={() => setSelectedReq(r)} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  <Printer size={14} /> جزئیات / چاپ
                </button>
              </div>

              <div className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto print:block print:overflow-visible">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-6 whitespace-nowrap">کالا</th>
                        <th className="py-3 px-6 text-center whitespace-nowrap">تأیید سرپرست</th>
                        {!isDeliveryMode ? (
                          <>
                            <th className="py-3 px-6 text-center whitespace-nowrap text-primary">تامین از انبار</th>
                            <th className="py-3 px-6 text-center whitespace-nowrap text-destructive">نیاز به خرید</th>
                          </>
                        ) : (
                          <>
                            <th className="py-3 px-6 text-center whitespace-nowrap text-blue-600">تامین شده</th>
                            <th className="py-3 px-6 text-center whitespace-nowrap text-teal-600">آماده تحویل</th>
                            <th className="py-3 px-6 text-center whitespace-nowrap">مقدار تحویلی</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-border">
                      {r.items.map((it, idx) => {
                        const totalAvailable = (it.whQty || 0) + (it.purchasedQty || 0);
                        return (
                          <tr key={idx} className="hover:bg-accent/30 transition-colors">
                            <td className="py-3 px-6 font-medium whitespace-nowrap">
                              <div>{it.itemName}</div>
                              {it.description && <div className="text-[10px] text-muted-foreground mt-0.5">{it.description}</div>}
                            </td>
                            <td className="py-3 px-6 text-center font-bold">
                              {farsiNum(it.supQty)} <span className="font-normal text-muted-foreground text-[10px]">{it.unit}</span>
                            </td>
                            {!isDeliveryMode ? (
                              <>
                                <td className="py-3 px-6 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <Package className="text-primary/70" size={16} />
                                    <input 
                                      type="number" 
                                      min="0" 
                                      max={it.supQty}
                                      value={it.whQty}
                                      onChange={(e) => handleQtyChange(r.id, idx, e.target.value, 'whQty')}
                                      className="w-20 bg-background border border-border rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary text-center font-bold"
                                    />
                                  </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                  {it.buyQty > 0 ? (
                                    <div className="inline-flex items-center gap-1.5 text-destructive bg-destructive/10 px-3 py-1 rounded-md font-bold text-xs">
                                      <ShoppingCart size={14} />
                                      {farsiNum(it.buyQty)}
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-md font-bold text-xs">
                                      <PackageCheck size={14} /> موجود
                                    </div>
                                  )}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-3 px-6 text-center">
                                  <div className="flex items-center justify-center gap-4">
                                    <div className="flex flex-col items-center">
                                      <span className="text-[9px] text-muted-foreground">انبار</span>
                                      <span className="font-bold">{farsiNum(it.whQty || 0)}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <span className="text-[9px] text-muted-foreground">خریداری</span>
                                      <span className="font-bold">{farsiNum(it.purchasedQty || 0)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-6 text-center font-bold text-teal-600">
                                  {farsiNum(totalAvailable)} <span className="font-normal text-[10px] text-muted-foreground">{it.unit}</span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                  <input 
                                    type="number" 
                                    min="0" 
                                    max={totalAvailable}
                                    value={it.deliveredQty}
                                    onChange={(e) => handleQtyChange(r.id, idx, e.target.value, 'deliveredQty')}
                                    className="w-20 bg-background border border-border rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-teal-500 text-center font-bold"
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view omitted for brevity but conceptually similar */}
                <div className="md:hidden flex flex-col divide-y divide-border print:hidden">
                  {r.items.map((it, idx) => {
                    const totalAvailable = (it.whQty || 0) + (it.purchasedQty || 0);
                    return (
                      <div key={idx} className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-sm">{it.itemName}</div>
                            <div className="text-xs text-muted-foreground">تأیید سرپرست: <strong className="text-foreground">{farsiNum(it.supQty)} {it.unit}</strong></div>
                          </div>
                        </div>
                        
                        {!isDeliveryMode ? (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-primary">تامین انبار:</span>
                              <input 
                                type="number" 
                                min="0" 
                                max={it.supQty}
                                value={it.whQty}
                                onChange={(e) => handleQtyChange(r.id, idx, e.target.value, 'whQty')}
                                className="w-16 bg-background border border-border rounded-md px-1 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary text-center font-bold"
                              />
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-muted-foreground">نیاز خرید</span>
                              <span className="font-bold text-destructive">{farsiNum(it.buyQty)}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-teal-600">مقدار تحویل:</span>
                              <input 
                                type="number" 
                                min="0" 
                                max={totalAvailable}
                                value={it.deliveredQty}
                                onChange={(e) => handleQtyChange(r.id, idx, e.target.value, 'deliveredQty')}
                                className="w-16 bg-background border border-border rounded-md px-1 py-1.5 text-xs outline-none focus:ring-2 focus:ring-teal-500 text-center font-bold"
                              />
                            </div>
                            <div className="flex flex-col items-end text-xs">
                              <span className="text-[10px] text-muted-foreground">آماده تحویل</span>
                              <span className="font-bold text-foreground">{farsiNum(totalAvailable)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden">
                {isDeliveryMode ? (
                  <button onClick={() => handleDeliver(r)} className="w-full sm:w-auto justify-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 lg:py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                    <PackageCheck size={16} /> ثبت مقدار تحویلی
                  </button>
                ) : (
                  <button onClick={() => handleConfirm(r)} className="w-full sm:w-auto justify-center bg-primary hover:bg-blue-600 text-white px-6 py-2.5 lg:py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                    <Package size={16} /> ثبت بررسی انبار
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {selectedReq && <RequestDetailsModal request={selectedReq} onClose={() => setSelectedReq(null)} />}
    </div>
  );
}
