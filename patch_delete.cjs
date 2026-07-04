const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
  app.delete('/api/requests/:id', authenticateToken, (req: any, res) => {
    const id = parseInt(req.params.id);
    const index = REQUESTS.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ message: 'Not found' });
    
    const request = REQUESTS[index];
    if (request.status !== 'pending_supervisor') {
      return res.status(400).json({ message: 'فقط درخواست‌های در انتظار تایید سرپرست قابل حذف هستند' });
    }
    if (req.user.role !== 'admin' && request.requesterId !== req.user.id) {
      return res.sendStatus(403);
    }

    REQUESTS.splice(index, 1);
    res.json({ success: true });
  });

  app.get('/api/requests'
`;

content = content.replace("app.get('/api/requests'", newEndpoint);
fs.writeFileSync('server.ts', content);
