const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

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
        it.deliveredQty = (it.whQty || 0) + (it.purchasedQty || 0);
      }
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

const regex = /app\.put\('\/api\/requests\/:id\/deliver'[\s\S]*?res\.json\(request\);\s*\}\);/;
content = content.replace(regex, deliverEndpoint);

fs.writeFileSync('server.ts', content);
