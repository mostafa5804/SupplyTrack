const fs = require('fs');
let content = fs.readFileSync('src/pages/Warehouse.tsx', 'utf8');

// replace the delivery handler to pass items
content = content.replace(
  /const handleDeliver = async \(req: Request\) => \{[\s\S]*?alert\('تحویل نهایی با موفقیت ثبت شد\.'\);/,
  `const handleDeliver = async (req: Request) => {
    try {
      await api.put(\`/requests/\${req.id}/deliver\`, { items: req.items });
      fetchData();
      alert('تحویل با موفقیت ثبت شد.');`
);

fs.writeFileSync('src/pages/Warehouse.tsx', content);
