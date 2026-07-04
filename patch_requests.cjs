const fs = require('fs');
let content = fs.readFileSync('src/pages/Requests.tsx', 'utf8');

const handleDelete = `
  const handleDelete = async (r: Request) => {
    if (confirm('آیا از حذف این درخواست اطمینان دارید؟')) {
      try {
        await api.delete(\`/requests/\${r.id}\`);
        fetchData();
        alert('درخواست با موفقیت حذف شد.');
      } catch (e: any) {
        alert(e.response?.data?.message || 'خطا در حذف درخواست');
      }
    }
  };

  const handleExport = () => {
`;
content = content.replace("const handleExport = () => {", handleDelete);

// replace desktop buttons
content = content.replace(
  /<div className="flex items-center gap-3">\s*<button onClick=\{\(\) => openDetails\(r\)\} className="text-primary hover:underline font-bold text-\[11px\] sm:text-xs">مشاهده<\/button>\s*\{r\.status === 'pending_supervisor' && \(r\.requesterId === user\?\.id \|\| user\?\.role === 'admin'\) && \(\s*<button onClick=\{\(\) => openEdit\(r\)\} className="text-muted-foreground hover:text-primary hover:underline font-bold text-\[11px\] sm:text-xs">ویرایش<\/button>\s*\)\}\s*<\/div>/,
  `<div className="flex items-center gap-3">
    <button onClick={() => openDetails(r)} className="text-primary hover:underline font-bold text-[11px] sm:text-xs">مشاهده</button>
    {r.status === 'pending_supervisor' && (r.requesterId === user?.id || user?.role === 'admin') && (
      <>
        <button onClick={() => openEdit(r)} className="text-muted-foreground hover:text-primary transition-colors" title="ویرایش"><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(r)} className="text-muted-foreground hover:text-destructive transition-colors" title="حذف"><Trash2 size={16} /></button>
      </>
    )}
  </div>`
);

// replace mobile buttons
content = content.replace(
  /<div className="flex gap-2 pt-2 border-t border-border\/50">\s*<button onClick=\{\(\) => openDetails\(r\)\} className="flex-1 bg-secondary hover:bg-secondary\/80 text-secondary-foreground py-2 rounded-lg text-xs font-bold transition-colors">مشاهده جزئیات<\/button>\s*\{r\.status === 'pending_supervisor' && \(r\.requesterId === user\?\.id \|\| user\?\.role === 'admin'\) && \(\s*<button onClick=\{\(\) => openEdit\(r\)\} className="flex-1 border border-border hover:bg-muted text-muted-foreground py-2 rounded-lg text-xs font-bold transition-colors">ویرایش درخواست<\/button>\s*\)\}\s*<\/div>/,
  `<div className="flex gap-2 pt-2 border-t border-border/50">
    <button onClick={() => openDetails(r)} className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-xs font-bold transition-colors">مشاهده</button>
    {r.status === 'pending_supervisor' && (r.requesterId === user?.id || user?.role === 'admin') && (
      <>
        <button onClick={() => openEdit(r)} className="flex-1 border border-border hover:bg-muted text-muted-foreground flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors"><Edit2 size={14} /> ویرایش</button>
        <button onClick={() => handleDelete(r)} className="flex-1 border border-destructive/20 hover:bg-destructive/10 text-destructive flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors"><Trash2 size={14} /> حذف</button>
      </>
    )}
  </div>`
);

fs.writeFileSync('src/pages/Requests.tsx', content);
