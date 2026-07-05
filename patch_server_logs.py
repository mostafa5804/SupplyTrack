import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add SMS_LOGS variable
if 'let SMS_LOGS: any[] = [];' not in content:
    content = content.replace("let INVENTORY: any[] = [];", "let INVENTORY: any[] = [];\nlet SMS_LOGS: any[] = [];")

# 2. Add SMS_LOGS to loadDB
load_db_new = """      SETTINGS = data.SETTINGS || { projectName: 'سامانه درخواست کالا', companyName: 'شرکت فولاد صنعت', logoUrl: '' };
      INVENTORY = data.INVENTORY || [];
      SMS_LOGS = data.SMS_LOGS || [];"""
content = re.sub(r"SETTINGS = data\.SETTINGS \|\| \{[^}]+\};\s*INVENTORY = data\.INVENTORY \|\| \[\];", load_db_new, content)

# 3. Add SMS_LOGS to saveDB
save_db_new = """      REQUESTS,
      requestCounter,
      logCounter,
      reqItemCounter,
      SETTINGS,
      INVENTORY,
      SMS_LOGS"""
content = re.sub(r"REQUESTS,\s*requestCounter,\s*logCounter,\s*reqItemCounter,\s*SETTINGS,\s*INVENTORY", save_db_new, content)

# 4. Modify sendSms to log
sms_old = """  try {
    const response = await fetch('https://api.sms.ir/v1/send/bulk', {
      method: 'POST',
      headers: {
        'X-API-KEY': SETTINGS.smsApiKey,
        'Content-Type': 'application/json',
        'ACCEPT': 'application/json'
      },
      body: JSON.stringify({
        lineNumber: Number(SETTINGS.smsLineNumber || 300000000000),
        messageText,
        mobiles: validMobiles,
        sendDateTime: null
      })
    });
    const data = await response.json();
    console.log('SMS sent:', data);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }"""

sms_new = """  try {
    const response = await fetch('https://api.sms.ir/v1/send/bulk', {
      method: 'POST',
      headers: {
        'X-API-KEY': SETTINGS.smsApiKey,
        'Content-Type': 'application/json',
        'ACCEPT': 'application/json'
      },
      body: JSON.stringify({
        lineNumber: Number(SETTINGS.smsLineNumber || 300000000000),
        messageText,
        mobiles: validMobiles,
        sendDateTime: null
      })
    });
    const data = await response.json();
    console.log('SMS sent:', data);
    
    SMS_LOGS.unshift({
      id: Date.now() + Math.floor(Math.random()*100),
      date: farsiDate() + ' ' + farsiTime(),
      mobiles: validMobiles.join(', '),
      message: messageText,
      status: data.status === 1 ? 'success' : 'failed',
      error: data.status !== 1 ? data.message : null
    });
    if (SMS_LOGS.length > 200) SMS_LOGS.length = 200; // keep last 200
  } catch (err: any) {
    console.error('Error sending SMS:', err);
    SMS_LOGS.unshift({
      id: Date.now() + Math.floor(Math.random()*100),
      date: farsiDate() + ' ' + farsiTime(),
      mobiles: validMobiles.join(', '),
      message: messageText,
      status: 'failed',
      error: err.message || 'خطای شبکه'
    });
    if (SMS_LOGS.length > 200) SMS_LOGS.length = 200;
  }"""
content = content.replace(sms_old, sms_new)

# 5. Add endpoints for /api/sms/logs and /api/sms/credit
endpoints = """
  app.get('/api/sms/logs', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    res.json(SMS_LOGS);
  });

  app.get('/api/sms/credit', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    if (!SETTINGS.smsApiKey) return res.json({ credit: 0, error: 'API Key تنظیم نشده است' });
    try {
      const response = await fetch('https://api.sms.ir/v1/credit', {
        headers: {
          'X-API-KEY': SETTINGS.smsApiKey,
          'ACCEPT': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 1) {
        res.json({ credit: data.data });
      } else {
        res.json({ credit: 0, error: data.message });
      }
    } catch (err: any) {
      res.json({ credit: 0, error: 'خطا در ارتباط با سرور پیامک' });
    }
  });
"""

if "app.get('/api/sms/logs'" not in content:
    content = content.replace("app.get('/api/settings'", endpoints + "\n  app.get('/api/settings'")

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
