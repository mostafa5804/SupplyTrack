const fs = require('fs');
let content = fs.readFileSync('src/pages/Warehouse.tsx', 'utf8');

const imports = `import React, { useEffect, useState } from 'react';
import { api, farsiNum, STATUS_MAP } from '../lib/utils';
import { Request } from '../types';
import { Printer, PackageCheck, Package, ShoppingCart, Search, AlertTriangle } from 'lucide-react';
import { RequestDetailsModal } from '../components/RequestDetailsModal';
import { useToast } from '../components/ToastProvider';`;

content = content.replace(/import React.*RequestDetailsModal';/s, imports);

const hookStart = `export function Warehouse() {
  const [activeTab, setActiveTab] = useState<'requests' | 'inventory'>('requests');
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();
`;
content = content.replace("export function Warehouse() {", hookStart);

const fetchCode = `  const fetchData = () => {
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
    api.get('/inventory').then(res => {
      setInventory(res.data);
      const lowItems = res.data.filter((it: any) => it.qty < it.minThreshold);
      if (lowItems.length > 0) {
        addToast(\`هشدار: \${farsiNum(lowItems.length)} قلم کالا زیر حد موجودی هستند\`, 'warning');
      }
    });
  };`;
content = content.replace(/  const fetchData = \(\) => \{[\s\S]*?api\.get\('\/users'\)\.then\(res => setUsers\(res\.data\)\);\n  \};/, fetchCode);

const uiCode = `  const filteredInventory = inventory.filter(it => 
    it.name.includes(searchQuery) || 
    it.sku.includes(searchQuery) || 
    it.category.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4 lg:space-y-8 w-full">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold">مدیریت انبار</h3>
        <div className="flex gap-2 print:hidden">
          <button onClick={() => setActiveTab('requests')} className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${activeTab === 'requests' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}\`}>
            درخواست‌ها
          </button>
          <button onClick={() => setActiveTab('inventory')} className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${activeTab === 'inventory' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}\`}>
            موجودی کالا
          </button>
          <button onClick={() => window.print()} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            🖨️ چاپ
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/50 flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden">
            <h4 className="font-bold">موجودی کالا (Inventory)</h4>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="جستجو (نام، کد، دسته‌بندی)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-muted text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-6 whitespace-nowrap">کد کالا (SKU)</th>
                  <th className="py-3 px-6 whitespace-nowrap">نام کالا</th>
                  <th className="py-3 px-6 whitespace-nowrap">دسته‌بندی</th>
                  <th className="py-3 px-6 text-center whitespace-nowrap">موجودی فعلی</th>
                  <th className="py-3 px-6 text-center whitespace-nowrap">حداقل موجودی</th>
                  <th className="py-3 px-6 text-center whitespace-nowrap">وضعیت</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-border">
                {filteredInventory.map((it, idx) => (
                  <tr key={idx} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-6 font-mono font-medium text-muted-foreground">{it.sku}</td>
                    <td className="py-3 px-6 font-bold">{it.name}</td>
                    <td className="py-3 px-6">
                      <span className="bg-secondary px-2 py-1 rounded-md text-[10px]">{it.category}</span>
                    </td>
                    <td className="py-3 px-6 text-center font-bold text-lg">{farsiNum(it.qty)}</td>
                    <td className="py-3 px-6 text-center text-muted-foreground">{farsiNum(it.minThreshold)}</td>
                    <td className="py-3 px-6 text-center">
                      {it.qty < it.minThreshold ? (
                        <div className="inline-flex items-center gap-1.5 text-destructive bg-destructive/10 px-3 py-1 rounded-md font-bold text-xs">
                          <AlertTriangle size={14} /> رو به اتمام
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-green-600 bg-green-600/10 px-3 py-1 rounded-md font-bold text-xs">
                          <PackageCheck size={14} /> مطلوب
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">کالایی یافت نشد.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {requests.length === 0 ? (`;

content = content.replace(/  return \(\s*<div className="max-w-6xl mx-auto space-y-4 lg:space-y-8 w-full">\s*<div className="flex justify-between items-center mb-4 lg:mb-6">\s*<h3 className="text-lg lg:text-xl font-bold">مدیریت انبار<\/h3>\s*<button onClick=\{\(\) => window.print\(\)\} className="bg-secondary text-secondary-foreground hover:bg-secondary\/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 print:hidden">\s*🖨️ چاپ\s*<\/button>\s*<\/div>\s*\{requests.length === 0 \? \(/, uiCode);

content = content.replace("        })", "        })\n      )}");

fs.writeFileSync('src/pages/Warehouse.tsx', content);
