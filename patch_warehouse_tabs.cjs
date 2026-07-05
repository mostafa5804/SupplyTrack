const fs = require('fs');
let code = fs.readFileSync('src/pages/Warehouse.tsx', 'utf-8');

// Add activeTab state
if (!code.includes('activeTab')) {
  code = code.replace(
    'const [selectedReq, setSelectedReq] = useState<Request | null>(null);',
    "const [selectedReq, setSelectedReq] = useState<Request | null>(null);\n  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');"
  );
}

// Update fetchData
code = code.replace(
  "const data = res.data.filter((r: Request) => ['approved_supervisor', 'warehouse_check', 'pending_delivery', 'partial_delivery'].includes(r.status));",
  "const data = res.data.filter((r: Request) => ['approved_supervisor', 'warehouse_check', 'pending_delivery', 'partial_delivery', 'completed'].includes(r.status));"
);

// Filter requests before mapping
const tabsUI = `
      <div className="flex gap-4 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={\`pb-2 px-1 text-sm font-bold transition-colors border-b-2 \${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}\`}
        >
          در انتظار / در حال انجام
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={\`pb-2 px-1 text-sm font-bold transition-colors border-b-2 \${activeTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}\`}
        >
          تحویل شده (پایان یافته)
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 lg:p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
`;

code = code.replace(
  "      {requests.length === 0 ? (\n        <div className=\"bg-card border border-border rounded-xl p-8 lg:p-12 text-center flex flex-col items-center justify-center min-h-[300px]\">",
  tabsUI
);

code = code.replace(
  "      <div className=\"flex justify-between items-center mb-4 lg:mb-6\">\n        <h3 className=\"text-lg lg:text-xl font-bold\">مدیریت انبار</h3>",
  `      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold">مدیریت انبار</h3>`
);

if (!code.includes('filteredRequests =')) {
  code = code.replace(
    'return (',
    `
  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending') return r.status !== 'completed';
    return r.status === 'completed';
  });

  return (`
  );
}

code = code.replace(
  "requests.map((r) => {",
  "filteredRequests.map((r) => {"
);

code = code.replace(
  "            <div key={r.id} className=\"bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500\">",
  "            <div key={r.id} className=\"bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500\">"
);

fs.writeFileSync('src/pages/Warehouse.tsx', code);
console.log('Tabs patched');
