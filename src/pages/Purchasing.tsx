import React, { useEffect, useState } from 'react';
import { api, farsiNum, STATUS_MAP } from '../lib/utils';
import { Request } from '../types';
import { Printer } from 'lucide-react';

export function Purchasing() {
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchData = () => {
    api.get('/requests').then(res => {
      const data = res.data.filter((r: Request) => r.status === 'purchase_list' || r.status === 'partial_purchase');
      // Initialize purchasedQty for inputs if not present
      data.forEach((r: Request) => {
        r.items.forEach(it => {
          if (it.purchasedQty === undefined) it.purchasedQty = 0;
        });
      });
      setRequests(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQtyChange = (reqId: number, itemIdx: number, val: string) => {
    const newReqs = [...requests];
    const req = newReqs.find(r => r.id === reqId);
    if (req) {
      const item = req.items[itemIdx];
      if (val === '') {
        item.purchasedQty = '' as any;
      } else {
        const numVal = parseInt(val, 10);
        const parsed = isNaN(numVal) ? 0 : numVal;
        const maxPurchase = item.buyQty;
        item.purchasedQty = Math.min(Math.max(0, parsed), maxPurchase);
      }
      setRequests(newReqs);
    }
  };

  const handleMarkPurchased = async (req: Request) => {
    try {
      await api.put(`/requests/${req.id}/purchase`, { items: req.items });
      fetchData();
      alert('اقلام خریداری شده ثبت شد.');
    } catch (e) {
      alert('خطا در ثبت خرید');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6 w-full">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold">لیست خرید (Purchase Order)</h3>
        <button onClick={() => window.print()} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 print:hidden">
          🖨️ چاپ
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 lg:p-12 text-center text-muted-foreground shadow-sm mb-8">
          <div className="text-3xl lg:text-4xl mb-4 opacity-50">🛒</div>
          <p className="text-sm lg:text-base">درخواستی برای خرید وجود ندارد</p>
        </div>
      ) : (
        requests.map(r => (
          <div key={r.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-4 lg:mb-8">
            <div className="bg-muted px-4 lg:px-6 py-3 lg:py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 print:hidden">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-sm">درخواست REQ-{farsiNum(r.id)}</h3>
                <span className="text-xs text-muted-foreground">{r.date}</span>
                <span className={STATUS_MAP[r.status]?.cls + ' px-2 py-1 rounded-md text-[10px] font-bold'}>{STATUS_MAP[r.status]?.label}</span>
              </div>
            </div>

            <div className="p-0">
              <div className="hidden md:block overflow-x-auto print:block print:overflow-visible">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-6 whitespace-nowrap">کالا</th>
                      <th className="py-3 px-6 text-center whitespace-nowrap">نیاز به خرید</th>
                      <th className="py-3 px-6 text-center whitespace-nowrap">قبلا خریداری شده</th>
                      <th className="py-3 px-6 text-center whitespace-nowrap">مقدار خرید جدید</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-border">
                    {r.items.map((it, idx) => {
                      if (it.buyQty === 0) return null;
                      return (
                        <tr key={idx} className="hover:bg-accent/30 transition-colors">
                          <td className="py-3 px-6 font-medium whitespace-nowrap">{it.itemName}</td>
                          <td className="py-3 px-6 text-center font-bold">{farsiNum(it.buyQty)} <span className="font-normal text-muted-foreground text-[10px]">{it.unit}</span></td>
                          <td className="py-3 px-6 text-center font-bold text-muted-foreground">{farsiNum(it.purchasedQty || 0)} <span className="font-normal text-[10px]">{it.unit}</span></td>
                          <td className="py-3 px-6 text-center">
                            <input 
                              type="number" 
                              min="0" 
                              max={it.buyQty}
                              value={it.purchasedQty}
                              onChange={(e) => handleQtyChange(r.id, idx, e.target.value)}
                              className="w-20 bg-background border border-border rounded-md px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-primary text-center"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col divide-y divide-border print:hidden">
                {r.items.map((it, idx) => {
                  if (it.buyQty === 0) return null;
                  return (
                    <div key={idx} className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm">{it.itemName}</span>
                        <span className="font-bold text-sm">{farsiNum(it.buyQty)} <span className="text-xs font-normal text-muted-foreground">{it.unit}</span></span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">خریداری شده: <strong className="text-foreground">{farsiNum(it.purchasedQty || 0)}</strong></span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">جدید:</span>
                          <input 
                            type="number" 
                            min="0" 
                            max={it.buyQty}
                            value={it.purchasedQty}
                            onChange={(e) => handleQtyChange(r.id, idx, e.target.value)}
                            className="w-16 bg-background border border-border rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary text-center"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden">
              <button onClick={() => handleMarkPurchased(r)} className="w-full sm:w-auto justify-center bg-primary hover:bg-blue-600 text-white px-6 py-2.5 lg:py-2 rounded-lg text-xs font-bold transition-colors">
                ثبت خرید (ارسال به انبار)
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
