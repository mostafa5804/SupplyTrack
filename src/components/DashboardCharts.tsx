import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Request } from '../types';
import { farsiNum } from '../lib/utils';

interface Props {
  requests: Request[];
}

export function DashboardCharts({ requests }: Props) {
  // Aggregate requests by date
  const dateCounts: Record<string, number> = {};
  requests.forEach(r => {
    // Assuming r.date is formatted as YYYY/MM/DD
    const d = r.date; 
    dateCounts[d] = (dateCounts[d] || 0) + 1;
  });

  const trendData = Object.keys(dateCounts).sort().slice(-7).map(date => ({
    name: date,
    "تعداد درخواست": dateCounts[date]
  }));

  // Simple item frequency
  const itemCounts: Record<string, number> = {};
  requests.forEach(r => {
    r.items.forEach(it => {
      itemCounts[it.itemName] = (itemCounts[it.itemName] || 0) + (it.reqQty || 0);
    });
  });

  const topItems = Object.keys(itemCounts)
    .sort((a, b) => itemCounts[b] - itemCounts[a])
    .slice(0, 5)
    .map(name => ({
      name,
      "تعداد": itemCounts[name]
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 mb-4 lg:mb-6">
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm h-72">
        <h4 className="text-sm font-bold mb-4 text-foreground">روند درخواست‌های ۷ روز اخیر</h4>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(val) => String(val)} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="تعداد درخواست" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm h-72">
        <h4 className="text-sm font-bold mb-4 text-foreground">۵ قلم کالای پردرخواست</h4>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={topItems} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(val) => String(val)} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Bar dataKey="تعداد" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
