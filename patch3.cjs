const fs = require('fs');
const path = require('path');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(
  "const DB_FILE = path.join(process.cwd(), 'db.json');",
  "const DATA_DIR = path.join(process.cwd(), '.data');\nif (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });\nconst DB_FILE = path.join(DATA_DIR, 'db.json');"
);
fs.writeFileSync('server.ts', code);
