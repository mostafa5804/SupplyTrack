import React, { useState } from 'react';
import { X, Printer, Eye, ArrowRight } from 'lucide-react';
import { Request } from '../types';
import { STATUS_MAP, cn } from '../lib/utils';
import { useSettings } from '../store/SettingsContext';

interface RequestDetailsModalProps {
  request: Request;
  onClose: () => void;
}

export function RequestDetailsModal({ request, onClose }: RequestDetailsModalProps) {
  const { settings } = useSettings();
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 lg:p-4 print:p-0 print:bg-white print:block">
      <div className={cn("bg-card border border-border w-full flex flex-col shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none", isPreview ? "max-w-[800px] h-full lg:h-auto rounded-none lg:rounded-xl" : "max-w-3xl rounded-2xl max-h-[90vh] print:max-w-none print:h-auto")}>
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border shrink-0 print:hidden">
          <h3 className="font-bold text-base lg:text-lg">
            {isPreview ? 'پیش‌نمایش چاپ' : `جزئیات درخواست REQ-${request.id}`}
          </h3>
          <div className="flex items-center gap-2">
            {!isPreview ? (
              <button onClick={() => setIsPreview(true)} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                <Eye size={16} /> پیش‌نمایش چاپ
              </button>
            ) : (
              <>
                <button onClick={() => setIsPreview(false)} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                  <ArrowRight size={16} /> بازگشت
                </button>
                <button onClick={() => window.print()} className="bg-primary text-primary-foreground hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                  <Printer size={16} /> چاپ / PDF
                </button>
              </>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-lg transition-colors ml-2"><X size={20}/></button>
          </div>
        </div>
        
        <div className={cn("overflow-y-auto print:overflow-visible print:p-0", isPreview ? "p-4 lg:p-8 bg-muted/30" : "p-4 lg:p-6")}>
          {isPreview ? (
            <div className="bg-white text-black w-full mx-auto print:m-0 print:w-full border-2 border-black" style={{ minHeight: '148mm' /* A5 Landscape approx height */ }}>
              {/* Print Header */}
              <div className="grid grid-cols-[1fr_2fr_1fr] border-b-2 border-black text-sm">
                <div className="flex flex-col border-l-2 border-black divide-y divide-black">
                  <div className="flex"><div className="w-32 p-1 border-l divide-x-0 border-black font-bold">کد سند</div><div className="flex-1 p-1">FM 225-040</div></div>
                  <div className="flex"><div className="w-32 p-1 border-l border-black font-bold">تاریخ درخواست:</div><div className="flex-1 p-1 text-center font-bold">{request.date}</div></div>
                  <div className="flex"><div className="w-32 p-1 border-l border-black font-bold">واحد درخواست کننده:</div><div className="flex-1 p-1"></div></div>
                  <div className="flex"><div className="w-32 p-1 border-l border-black font-bold">تحویل گیرنده:</div><div className="flex-1 p-1"></div></div>
                  <div className="flex"><div className="w-32 p-1 border-l border-black font-bold">شماره درخواست:</div><div className="flex-1 p-1 text-center font-bold">REQ-{request.id}</div></div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <h1 className="text-xl font-bold mb-2">درخواست کالا از انبار</h1>
                  <h2 className="text-lg font-bold">{settings.projectName}</h2>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border-r-2 border-black">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-2" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center font-bold text-xl mb-2">{settings.companyName.charAt(0)}</div>
                  )}
                  <div className="text-xs font-bold">{settings.companyName}</div>
                </div>
              </div>

              {/* Print Body Table */}
              <table className="w-full text-center text-sm border-b-2 border-black border-collapse">
                <thead>
                  <tr className="divide-x divide-x-reverse divide-black border-b-2 border-black font-bold">
                    <th className="p-2 w-12 border-l border-black">ردیف</th>
                    <th className="p-2 border-l border-black">شرح کالا</th>
                    <th className="p-2 w-24 border-l border-black">واحد</th>
                    <th className="p-2 w-24 border-l border-black">مقدار</th>
                    <th className="p-2 w-64">توضیحات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {Array.from({ length: Math.max(8, request.items.length) }).map((_, idx) => {
                    const item = request.items[idx];
                    return (
                      <tr key={idx} className="divide-x divide-x-reverse divide-black h-8">
                        <td className="p-1 border-l border-black font-bold text-xs">{idx + 1}</td>
                        <td className="p-1 border-l border-black text-right pr-2 font-bold">{item?.itemName || ''}</td>
                        <td className="p-1 border-l border-black">{item?.unit || ''}</td>
                        <td className="p-1 border-l border-black font-bold">{item?.reqQty || ''}</td>
                        <td className="p-1 text-right pr-2 text-xs">{item?.description || ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Print Footer */}
              <div className="grid grid-cols-4 divide-x divide-x-reverse divide-black min-h-[100px] text-sm">
                <div className="p-2 font-bold border-l border-black">درخواست کننده:</div>
                <div className="p-2 font-bold border-l border-black">سرپرست واحد:</div>
                <div className="p-2 font-bold border-l border-black">سرپرست پشتیبانی:</div>
                <div className="p-2 font-bold">سرپرست کارگاه:</div>
              </div>
            </div>
          ) : (
            <div className="print:hidden">
              <div className="mb-6 pb-6 border-b border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs font-bold mb-1">شماره درخواست</div>
                    <div className="font-mono font-bold">REQ-{request.id}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs font-bold mb-1">تاریخ ثبت</div>
                    <div className="font-medium">{request.date}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs font-bold mb-1">وضعیت فعلی</div>
                    <div className="font-medium">
                      <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold inline-block", STATUS_MAP[request.status]?.cls)}>
                        {STATUS_MAP[request.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold mb-3 text-sm">اقلام درخواستی</h4>
              <div className="border border-border rounded-xl overflow-hidden mb-6">
                <table className="w-full text-right text-sm">
                  <thead className="bg-muted border-b border-border text-xs">
                    <tr>
                      <th className="py-2.5 px-4">ردیف</th>
                      <th className="py-2.5 px-4">نام کالا</th>
                      <th className="py-2.5 px-4 text-center">تعداد درخواستی</th>
                      <th className="py-2.5 px-4 text-center">تأیید شده</th>
                      <th className="py-2.5 px-4">توضیحات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {request.items.map((it, idx) => (
                      <tr key={it.id}>
                        <td className="py-2.5 px-4 text-muted-foreground">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-medium">{it.itemName}</td>
                        <td className="py-2.5 px-4 text-center font-bold">{it.reqQty} <span className="font-normal text-xs text-muted-foreground">{it.unit}</span></td>
                        <td className="py-2.5 px-4 text-center font-bold">
                          {request.status !== 'pending_supervisor' ? (
                            <>{it.supQty} <span className="font-normal text-xs text-muted-foreground">{it.unit}</span></>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-muted-foreground">{it.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold mb-3 text-sm">تاریخچه فرآیند</h4>
              <div className="space-y-4">
                {request.logs.map(log => (
                  <div key={log.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border text-sm">
                      {log.icon}
                    </div>
                    <div className="flex-1 bg-muted/30 border border-border p-3 rounded-xl text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="font-bold">{log.action}</span>
                        <span className="text-xs text-muted-foreground" >{log.date}</span>
                      </div>
                      <div className="text-muted-foreground text-xs">توسط: {log.user}</div>
                      {log.comment && (
                        <div className="mt-2 text-xs bg-background p-2 rounded border border-border break-words">
                          <span className="font-bold">توضیحات: </span>
                          {log.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
