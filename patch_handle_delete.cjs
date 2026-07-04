const fs = require('fs');
let content = fs.readFileSync('src/pages/Requests.tsx', 'utf8');

const handleDelete = `  const handleDelete = async (r: Request) => {
    if (confirm('آیا از حذف این درخواست اطمینان دارید؟')) {
      try {
        await api.delete(\`/requests/\${r.id}\`);
        fetchData();
      } catch (e) {
        alert('خطا در حذف درخواست');
      }
    }
  };

  const openDetails =`;

content = content.replace("  const openDetails =", handleDelete);
fs.writeFileSync('src/pages/Requests.tsx', content);
