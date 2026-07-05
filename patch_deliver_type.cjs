const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(
  "app.put('/api/requests/:id/deliver', authenticateToken, (req, res) => {",
  "app.put('/api/requests/:id/deliver', authenticateToken, (req: any, res) => {"
);
fs.writeFileSync('server.ts', code);
