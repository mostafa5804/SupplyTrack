import React, { useEffect, useState } from 'react';
import { api, STATUS_MAP, farsiNum } from '../lib/utils';
import { Request } from '../types';
import { FileText, Clock, CheckSquare, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { RequestDetailsModal } from '../components/RequestDetailsModal';
import { DashboardCharts } from '../components/DashboardCharts';

export function Dashboard() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    api.get('/requests').then(res => setRequests(res.data));
    api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const pending = requests.filter(r => r.status === 'pending_supervisor').length;
  const inWarehouse = requests.filter(r => r.status === 'warehouse_check' || r.status === 'approved_supervisor').length;
  const purchaseNeeded = requests.filter(r => r.status === 'purchase_list').length;
  const completed = requests.filter(r => r.status === 'completed').length;

  const handleExportCSV = () => {
    // Generate simple CSV
    let csv = '\uFEFF' + 'شناسه درخواست,تاریخ ثبت,تعداد اقلام,وضعیت فرآیند\n';
    requests.slice().reverse().forEach(r => {
      const s = STATUS_MAP[r.status];
      csv += `REQ-${r.id},${r.date},${farsiNum(r.items.length)},${s?.label}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `آخرین_درخواست_ها_${farsiNum(new Intl.DateTimeFormat('fa-IR', { numberingSystem: 'arabext' }).format(new Date()))}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDetails = (r: Request) => {
    setSelectedReq(r);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-4 lg:space-y-6 flex-1 flex flex-col min-w-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <StatCard title="کل درخواست‌ها" value={requests.length} subtitle="تمامی ثبت شده‌ها" valueColor="text-foreground" />
        <StatCard title="در انتظار سرپرست" value={pending} subtitle="نیاز به بررسی" valueColor="text-amber-500" />
        <StatCard title="در انتظار خرید" value={purchaseNeeded} subtitle="نیاز به تهیه" valueColor="text-red-500" />
        <StatCard title="تحویل شده" value={completed} subtitle="درخواست نهایی شده" valueColor="text-primary" />
      </div>

      <DashboardCharts requests={requests} />

      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
        <div className="px-4 lg:px-6 py-4 border-b border-border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground">آخرین درخواست‌های کالا</h3>
            <span className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">زنده</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportCSV} className="text-xs font-bold px-3 py-1.5 border border-border rounded-lg hover:bg-secondary transition-colors">خروجی اکسل / CSV</button>
            <Link to="/requests" className="text-xs font-bold px-3 py-1.5 bg-primary text-primary-foreground rounded-lg shadow-sm">ثبت درخواست جدید</Link>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-right border-collapse">
              <thead className="bg-muted sticky top-0 border-b border-border z-10">
                <tr className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3 whitespace-nowrap">شناسه</th>
                  <th className="px-6 py-3 whitespace-nowrap">درخواست دهنده</th>
                  <th className="px-6 py-3 whitespace-nowrap">تاریخ ثبت</th>
                  <th className="px-6 py-3 text-center whitespace-nowrap">تعداد اقلام</th>
                  <th className="px-6 py-3 whitespace-nowrap">وضعیت فرآیند</th>
                  <th className="px-6 py-3 whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-border">
                {requests.slice().reverse().map(r => {
                  const s = STATUS_MAP[r.status];
                  const reqUser = users.find(u => u.id === r.requesterId);
                  return (
                    <tr key={r.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-muted-foreground font-bold whitespace-nowrap">REQ-{farsiNum(r.id)}</td>
                      <td className="px-6 py-3.5 font-bold whitespace-nowrap">{reqUser?.name || 'نامشخص'}</td>
                      <td className="px-6 py-3.5 font-medium whitespace-nowrap">{r.date}</td>
                      <td className="px-6 py-3.5 text-center font-bold whitespace-nowrap">{farsiNum(r.items.length)} ردیف</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold", s?.cls)}>
                          {s?.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <button onClick={() => openDetails(r)} className="text-primary hover:underline font-bold text-xs">مشاهده</button>
                      </td>
                    </tr>
                  );
                })}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">درخواستی یافت نشد.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col divide-y divide-border">
            {requests.slice().reverse().map(r => {
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
                  
                  <div className="pt-2 border-t border-border/50">
                    <button onClick={() => openDetails(r)} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-xs font-bold transition-colors">مشاهده جزئیات</button>
                  </div>
                </div>
              );
            })}
            {requests.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">درخواستی یافت نشد.</div>
            )}
          </div>
        </div>
      </div>

      {isDetailOpen && selectedReq && (
        <RequestDetailsModal request={selectedReq} onClose={() => setIsDetailOpen(false)} />
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, valueColor }: { title: string, value: number | string, subtitle: string, valueColor: string }) {
  return (
    <div className="bg-card p-3 lg:p-4 rounded-xl border border-border shadow-sm">
      <div className="text-muted-foreground text-[10px] lg:text-xs font-bold">{title}</div>
      <div className={cn("text-xl lg:text-2xl font-bold mt-1", valueColor)}>{farsiNum(value)}</div>
      <div className="text-muted-foreground text-[9px] lg:text-[10px] mt-1 truncate">{subtitle}</div>
    </div>
  );
}
