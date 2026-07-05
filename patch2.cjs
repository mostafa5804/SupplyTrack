const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(
`  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // --- API ROUTES ---`,
`  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Auto-save DB on mutating requests
  app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        saveDB();
      }
      return originalJson.call(this, body);
    };
    next();
  });

  // --- API ROUTES ---`
);
fs.writeFileSync('server.ts', code);
