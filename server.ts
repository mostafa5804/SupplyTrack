const farsiDate = () => new Intl.DateTimeFormat("fa-IR", { calendar: "persian", numberingSystem: "arabext", timeZone: "Asia/Tehran" }).format(new Date());
const farsiTime = () => new Intl.DateTimeFormat("fa-IR", { timeStyle: "short", numberingSystem: "arabext", timeZone: "Asia/Tehran" }).format(new Date());

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_jwt_key_123";

import fs from "fs";

// --- FILE-BASED DATA STORE ---
const DATA_DIR = path.join(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_FILE = path.join(DATA_DIR, 'db.json');
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

loadDB();

// --- MIDDLEWARES ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

  // --- API ROUTES ---
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
  });

  app.get('/api/me', authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  app.get('/api/settings', (req, res) => {
    res.json(SETTINGS);
  });

  app.put('/api/settings', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    SETTINGS = { ...SETTINGS, ...req.body };
    res.json(SETTINGS);
  });

  app.post('/api/reset', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    REQUESTS.length = 0;
    requestCounter = 1000;
    reqItemCounter = 1;
    logCounter = 1;
    saveDB();
    res.json({ success: true, message: 'اطلاعات با موفقیت بازنشانی شد.' });
  });

  

app.get('/api/inventory', authenticateToken, (req, res) => {
  res.json(INVENTORY);
});

  app.get('/api/users', authenticateToken, (req, res) => {
    res.json(USERS.map(u => ({ id: u.id, name: u.name, username: u.username, role: u.role, department: u.department })));
  });

  app.post('/api/users', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    const { name, username, password, role, department } = req.body;
    if (USERS.find(u => u.username === username)) return res.status(400).json({ message: 'نام کاربری تکراری است' });
    
    const newUser = {
      id: userCounter++,
      name,
      username,
      passwordHash: bcrypt.hashSync(password || '123456', 10),
      role,
      department
    };
    USERS.push(newUser);
    res.json({ id: newUser.id });
  });

  app.put('/api/users/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    const user = USERS.find(u => u.id === id);
    if (!user) return res.sendStatus(404);

    const { name, username, password, role, department } = req.body;
    if (username !== user.username && USERS.find(u => u.username === username)) return res.status(400).json({ message: 'نام کاربری تکراری است' });

    user.name = name;
    user.username = username;
    user.role = role;
    user.department = department;
    if (password) {
      user.passwordHash = bcrypt.hashSync(password, 10);
    }
    res.json({ success: true });
  });

  app.delete('/api/users/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    if (id === req.user.id) return res.status(400).json({ message: 'نمی‌توانید خودتان را حذف کنید' });
    USERS = USERS.filter(u => u.id !== id);
    res.json({ success: true });
  });

  
  app.delete('/api/requests/:id', authenticateToken, (req: any, res) => {
    const id = parseInt(req.params.id);
    const index = REQUESTS.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ message: 'Not found' });
    
    const request = REQUESTS[index];
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor' && request.status !== 'pending_supervisor') {
      return res.status(400).json({ message: 'فقط درخواست‌های در انتظار تایید سرپرست قابل حذف هستند' });
    }
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor' && request.requesterId !== req.user.id) {
      return res.sendStatus(403);
    }

    REQUESTS.splice(index, 1);
    res.json({ success: true });
  });

  app.get('/api/requests'
, authenticateToken, (req: any, res) => {
    let result = REQUESTS;
    if (req.user.role === 'requester') {
      result = REQUESTS.filter(r => r.requesterId === req.user.id);
    }
    res.json(result);
  });

  app.post('/api/requests', authenticateToken, (req: any, res) => {
    const { items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items provided' });
    
    const newReq = {
      id: requestCounter++,
      requesterId: req.user.id,
      date: farsiDate(),
      status: 'pending_supervisor', // MVP: go straight to supervisor
      items: items.map((it: any) => ({
        id: reqItemCounter++,
        itemName: it.itemName,
        unit: it.unit,
        description: it.description || '',
        reqQty: it.qty,
        supQty: 0,
        whQty: 0,
        buyQty: 0
      })),
      logs: [{
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'ثبت درخواست',
        icon: '📝'
      }]
    };
    REQUESTS.push(newReq);
    res.json(newReq);
  });

  app.put('/api/requests/:id', authenticateToken, (req: any, res) => {
    const id = parseInt(req.params.id);
    const { items } = req.body;
    
    const request = REQUESTS.find(r => r.id === id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    
    if (request.status !== 'pending_supervisor') {
      return res.status(400).json({ message: 'فقط درخواست‌های در انتظار تأیید قابل ویرایش هستند' });
    }

    if (request.requesterId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'supervisor') {
      return res.sendStatus(403);
    }

    request.items = items.map((it: any) => ({
      id: it.id || reqItemCounter++,
      itemName: it.itemName,
      unit: it.unit,
      description: it.description || '',
      reqQty: it.qty || it.reqQty,
      supQty: 0,
      whQty: 0,
      buyQty: 0
    }));

    request.logs.push({
      id: logCounter++,
      user: req.user.name,
      date: farsiDate() + ' ' + farsiTime(),
      action: 'ویرایش درخواست',
      icon: '✏️'
    });

    res.json(request);
  });

  app.put('/api/requests/:id/supervisor', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'supervisor' && req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    const { action, items, comment } = req.body;
    
    const request = REQUESTS.find(r => r.id === id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    
    if (action === 'approve') {
      // Check for quantity modifications
      items.forEach((newItem: any) => {
        const oldItem = request.items.find((it: any) => it.id === newItem.id);
        if (oldItem && newItem.supQty !== oldItem.reqQty) {
          request.logs.push({
            id: logCounter++,
            user: req.user.name,
            date: farsiDate() + ' ' + farsiTime(),
            action: `ویرایش مقدار تایید شده "${newItem.itemName}" از ${oldItem.reqQty} به ${newItem.supQty} ${newItem.unit}`,
            icon: '✏️'
          });
        }
      });
      request.status = 'warehouse_check';
      request.items = items; // updated items with supQty
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تأیید سرپرست',
        icon: '✅',
        comment
      });
    } else if (action === 'reject') {
      request.status = 'rejected';
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
    }
    res.json(request);
  });

  app.put('/api/requests/:id/warehouse', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'storekeeper' && req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    const { items } = req.body; // updated items with whQty and buyQty
    
    const request = REQUESTS.find(r => r.id === id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    
    request.items = items;
    const hasShortage = request.items.some((it: any) => it.buyQty > 0);
    request.status = hasShortage ? 'purchase_list' : 'pending_delivery';

    request.logs.push({
      id: logCounter++,
      user: req.user.name,
      date: farsiDate() + ' ' + farsiTime(),
      action: hasShortage ? 'بررسی انبار — کسری ثبت شد و به لیست خرید ارسال گردید' : 'بررسی انبار — تمام اقلام موجود بود',
      icon: '📦'
    });

    if (!hasShortage) {
       request.logs.push({
          id: logCounter++,
          user: req.user.name,
          date: farsiDate() + ' ' + farsiTime(),
          action: 'تحویل نهایی به درخواست‌کننده',
          icon: '🎯'
        });
    }

    res.json(request);
  });

  
    app.put('/api/requests/:id/deliver', authenticateToken, (req: any, res) => {
    try {
      if (req.user.role !== 'storekeeper' && req.user.role !== 'admin' && req.user.role !== 'supervisor' && req.user.role !== 'warehouse') return res.sendStatus(403);
      const id = parseInt(req.params.id);
      const { items } = req.body;
      
      const request = REQUESTS.find(r => r.id === id);
      if (!request) return res.status(404).json({ message: 'Not found' });
      
      if (!items || !Array.isArray(items)) return res.status(400).json({ message: 'Items array missing' });

      let allDelivered = true;
      request.items.forEach((it, idx) => {
        const sentItem = items[idx];
        const dQty = parseInt(sentItem?.deliveredQty) || 0;
        
        it.totalDelivered = (it.totalDelivered || 0) + dQty;
        it.whQty = (it.whQty || 0) - dQty;
        
        if (it.whQty < 0) it.whQty = 0;
        
        delete it.deliveredQty;

        if ((it.totalDelivered || 0) < (it.supQty || 0)) {
          allDelivered = false;
        }
      });
      
      request.status = allDelivered ? 'completed' : 'partial_delivery';

      request.logs.push({
        id: logCounter++,
        user: req.user.name || 'System',
        date: farsiDate() + ' ' + farsiTime(),
        action: allDelivered ? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
        icon: '🎁'
      });

      saveDB();
      res.json(request);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

app.put('/api/requests/:id/purchase', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'purchaser' && req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    const id = parseInt(req.params.id);
    const { items } = req.body;
    
    const request = REQUESTS.find(r => r.id === id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    
    request.items = items;
    let allPurchased = true;
    let somePurchased = false;

    request.items.forEach((it: any) => {
      const pQty = parseInt(it.purchasedQty) || 0;
      if (pQty > 0) {
        somePurchased = true;
        it.whQty = (it.whQty || 0) + pQty;
        it.buyQty -= pQty;
        it.purchasedQty = 0;
      }
      if (it.buyQty > 0) {
        allPurchased = false;
      }
    });

    if (somePurchased) {
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'خرید اقلام و تحویل به انبار',
        icon: '🛒'
      });
    }

    if (allPurchased) {
      request.status = 'pending_delivery';
      request.logs.push({
        id: logCounter++,
        user: 'سیستم',
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تکمیل فرآیند تامین - آماده تحویل',
        icon: '🎯'
      });
    } else {
      request.status = 'partial_purchase';
    }

    res.json(request);
  });

  app.put('/api/purchase', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'purchaser' && req.user.role !== 'admin' && req.user.role !== 'supervisor') return res.sendStatus(403);
    
    const purchaseReqs = REQUESTS.filter(r => r.status === 'purchase_list');
    purchaseReqs.forEach(r => {
      r.items.forEach((it: any) => {
        if (it.buyQty > 0) {
          it.whQty += it.buyQty;
          it.buyQty = 0;
        }
      });
      r.status = 'pending_delivery';
      r.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'خرید اقلام کسری و تحویل به انبار',
        icon: '🛒'
      });
      r.logs.push({
        id: logCounter++,
        user: 'سیستم',
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تحویل نهایی به درخواست‌کننده',
        icon: '🎯'
      });
    });

    res.json({ success: true, count: purchaseReqs.length });
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === "production" || process.argv[1]?.endsWith('server.cjs');

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
