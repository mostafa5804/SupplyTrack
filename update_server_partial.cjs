const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Modify the seed data to ensure items have purchasedQty and deliveredQty
content = content.replace(
  /reqQty: 2, supQty: 2, whQty: 2, buyQty: 0 \}/g,
  'reqQty: 2, supQty: 2, whQty: 2, buyQty: 0, purchasedQty: 0, deliveredQty: 0 }'
);
content = content.replace(
  /reqQty: 50, supQty: 50, whQty: 10, buyQty: 40 \}/g,
  'reqQty: 50, supQty: 50, whQty: 10, buyQty: 40, purchasedQty: 0, deliveredQty: 0 }'
);
content = content.replace(
  /reqQty: 100, supQty: 100, whQty: 100, buyQty: 0 \}/g,
  'reqQty: 100, supQty: 100, whQty: 100, buyQty: 0, purchasedQty: 0, deliveredQty: 0 }'
);
content = content.replace(
  /reqQty: 10, supQty: 10, whQty: 0, buyQty: 0 \}/g,
  'reqQty: 10, supQty: 10, whQty: 0, buyQty: 0, purchasedQty: 0, deliveredQty: 0 }'
);
content = content.replace(
  /reqQty: 20, supQty: 20, whQty: 0, buyQty: 0 \}/g,
  'reqQty: 20, supQty: 20, whQty: 0, buyQty: 0, purchasedQty: 0, deliveredQty: 0 }'
);

content = content.replace(
  /app\.post\('\/api\/requests', authenticateToken, \(req: any, res\) => \{/,
  `app.post('/api/requests', authenticateToken, (req: any, res) => {
    req.body.items.forEach((it: any) => {
      it.whQty = 0;
      it.buyQty = 0;
      it.purchasedQty = 0;
      it.deliveredQty = 0;
    });`
);

// We need a specific endpoint to purchase an item or a set of items for a request.
const purchaseEndpoint = `
  app.put('/api/requests/:id/purchase', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'purchaser' && req.user.role !== 'admin') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    const request = REQUESTS.find(r => r.id === id);
    if (!request) return res.status(404).json({ message: 'Not found' });

    const { items } = req.body;
    let allPurchased = true;
    let somePurchased = false;

    request.items.forEach((it: any, idx: number) => {
      if (items[idx] && items[idx].purchasedQty !== undefined) {
        it.purchasedQty = items[idx].purchasedQty;
      }
      if (it.purchasedQty < it.buyQty) {
        allPurchased = false;
      }
      if (it.purchasedQty > 0) {
        somePurchased = true;
      }
    });

    if (allPurchased) {
      request.status = 'pending_delivery';
    } else if (somePurchased) {
      request.status = 'partial_purchase';
    } else {
      request.status = 'purchase_list';
    }

    request.logs.push({
      id: logCounter++,
      user: req.user.name,
      date: farsiDate() + ' ' + farsiTime(),
      action: allPurchased ? 'خرید اقلام کامل شد' : 'ثبت خرید ناقص اقلام',
      icon: '🛒'
    });

    res.json(request);
  });
`;

content = content.replace("app.put('/api/purchase'", purchaseEndpoint + "\n  app.put('/api/purchase'");

// Delivery endpoint
const deliverEndpoint = `
  app.put('/api/requests/:id/deliver', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'storekeeper' && req.user.role !== 'admin') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    const request = REQUESTS.find(r => r.id === id);
    if (!request) return res.status(404).json({ message: 'Not found' });

    const { items } = req.body;
    let allDelivered = true;
    let someDelivered = false;

    request.items.forEach((it: any, idx: number) => {
      if (items && items[idx] && items[idx].deliveredQty !== undefined) {
        it.deliveredQty = items[idx].deliveredQty;
      } else if (!items) {
        // legacy full delivery if no items provided
        it.deliveredQty = (it.whQty || 0) + (it.purchasedQty || 0);
      }
      const totalAvailableToDeliver = (it.whQty || 0) + (it.buyQty || 0); // Need to deliver full requested amount
      if (it.deliveredQty < it.supQty) {
        allDelivered = false;
      }
      if (it.deliveredQty > 0) {
        someDelivered = true;
      }
    });

    if (allDelivered) {
      request.status = 'completed';
    } else if (someDelivered) {
      request.status = 'partial_delivery';
    }

    request.logs.push({
      id: logCounter++,
      user: req.user.name,
      date: farsiDate() + ' ' + farsiTime(),
      action: allDelivered ? 'تحویل نهایی به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
      icon: '🎯'
    });

    res.json(request);
  });
`;
content = content.replace(/app\.put\('\/api\/requests\/:id\/deliver'[\s\S]*?res\.json\(request\);\s*\});/, deliverEndpoint);

fs.writeFileSync('server.ts', content);
