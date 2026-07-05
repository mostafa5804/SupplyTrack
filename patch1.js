const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(
`import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_jwt_key_123";

// --- IN MEMORY DATA STORE ---
let USERS = [
  { id: 1, name: 'مدیر سیستم', username: 'admin', passwordHash: bcrypt.hashSync('admin', 10), role: 'admin', department: 'فناوری اطلاعات' }
];

let userCounter = 2;

let REQUESTS: any[] = [];
let requestCounter = 1000;
let logCounter = 1;
let reqItemCounter = 1;
let SETTINGS = {
  projectName: 'سامانه درخواست کالا',
  companyName: 'شرکت فولاد صنعت',
  logoUrl: '' // optional base64 or URL
};`,
`import fs from "fs";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_jwt_key_123";

// --- FILE-BASED DATA STORE ---
const DB_FILE = path.join(process.cwd(), 'db.json');
let USERS: any[] = [];
let userCounter = 2;
let REQUESTS: any[] = [];
let requestCounter = 1000;
let logCounter = 1;
let reqItemCounter = 1;
let SETTINGS: any = { projectName: 'سامانه درخواست کالا', companyName: 'شرکت فولاد صنعت', logoUrl: '' };
let INVENTORY: any[] = [];

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      USERS = data.USERS || [];
      userCounter = data.userCounter || 2;
      REQUESTS = data.REQUESTS || [];
      requestCounter = data.requestCounter || 1000;
      logCounter = data.logCounter || 1;
      reqItemCounter = data.reqItemCounter || 1;
      SETTINGS = data.SETTINGS || { projectName: 'سامانه درخواست کالا', companyName: 'شرکت فولاد صنعت', logoUrl: '' };
      INVENTORY = data.INVENTORY || [];
      return;
    }
  } catch(e) {
    console.error(e);
  }
  // Defaults if file doesn't exist
  USERS = [
    { id: 1, name: 'مدیر سیستم', username: 'admin', passwordHash: bcrypt.hashSync('admin', 10), role: 'admin', department: 'فناوری اطلاعات' }
  ];
  INVENTORY = [
    { id: 1, name: 'کابل برق ۲.۵ میلی', sku: 'CBL-025', category: 'الکتریکی', qty: 50, minThreshold: 100 },
    { id: 2, name: 'پیچ متری M10×40', sku: 'SCR-M10', category: 'یراق آلات', qty: 500, minThreshold: 200 },
    { id: 3, name: 'چراغ مهتابی ۳۶ وات', sku: 'LMP-36W', category: 'روشنایی', qty: 10, minThreshold: 50 },
    { id: 4, name: 'کلید مینیاتوری ۱۶A', sku: 'SWT-16A', category: 'الکتریکی', qty: 5, minThreshold: 20 },
    { id: 5, name: 'لوله پولیکا نمره ۱۰', sku: 'PIP-10', category: 'تأسیسات', qty: 120, minThreshold: 50 }
  ];
  saveDB();
}

function saveDB() {
  const data = { USERS, userCounter, REQUESTS, requestCounter, logCounter, reqItemCounter, SETTINGS, INVENTORY };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch(e) {
    console.error(e);
  }
}

loadDB();`
);
fs.writeFileSync('server.ts', code);
