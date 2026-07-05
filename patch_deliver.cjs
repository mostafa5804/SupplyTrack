const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
const deliverEndpoint = `
  app.put('/api/requests/:id/deliver', authenticateToken, (req, res) => {
    if (req.user.role !== 'storekeeper' && req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    const { items } = req.body;
    
    const request = REQUESTS.find(r => r.id === id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    
    // items sent from client have the new deliveredQty
    let allDelivered = true;
    request.items.forEach((it, idx) => {
      const sentItem = items[idx];
      const dQty = parseInt(sentItem?.deliveredQty) || 0;
      
      it.totalDelivered = (it.totalDelivered || 0) + dQty;
      it.whQty = (it.whQty || 0) - dQty;
      
      // Prevent negative whQty
      if (it.whQty < 0) it.whQty = 0;
      
      // We don't save deliveredQty, it's just a transient field for the current delivery action
      delete it.deliveredQty;

      if ((it.totalDelivered || 0) < it.supQty) {
        allDelivered = false;
      }
    });
    
    request.status = allDelivered ? 'completed' : 'partial_delivery';

    request.logs.push({
      id: logCounter++,
      user: req.user.name,
      date: farsiDate() + ' ' + farsiTime(),
      action: allDelivered ? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
      icon: '🎁'
    });

    saveDB();
    res.json(request);
  });
`;

if (!code.includes("app.put('/api/requests/:id/deliver'")) {
  code = code.replace(
    "app.put('/api/requests/:id/purchase'", 
    deliverEndpoint + "\n  app.put('/api/requests/:id/purchase'"
  );
  fs.writeFileSync('server.ts', code);
  console.log("Added deliver endpoint");
} else {
  console.log("Deliver endpoint already exists");
}
