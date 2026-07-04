const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const INVENTORY = `
let INVENTORY = [
  { id: 1, name: 'کابل برق ۲.۵ میلی', sku: 'CBL-025', category: 'الکتریکی', qty: 50, minThreshold: 100 },
  { id: 2, name: 'پیچ متری M10×40', sku: 'SCR-M10', category: 'یراق آلات', qty: 500, minThreshold: 200 },
  { id: 3, name: 'چراغ مهتابی ۳۶ وات', sku: 'LMP-36W', category: 'روشنایی', qty: 10, minThreshold: 50 },
  { id: 4, name: 'کلید مینیاتوری ۱۶A', sku: 'SWT-16A', category: 'الکتریکی', qty: 5, minThreshold: 20 },
  { id: 5, name: 'لوله پولیکا نمره ۱۰', sku: 'PIP-10', category: 'تأسیسات', qty: 120, minThreshold: 50 }
];

app.get('/api/inventory', authenticateToken, (req, res) => {
  res.json(INVENTORY);
});
`;

content = content.replace("app.get('/api/users'", INVENTORY + "\n  app.get('/api/users'");
fs.writeFileSync('server.ts', content);
