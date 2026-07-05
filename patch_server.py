import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add sendSms helper
sms_helper = """
// SMS Helper
async function sendSms(mobiles: string[], messageText: string) {
  if (!mobiles || mobiles.length === 0) return;
  const validMobiles = mobiles.filter(m => m && m.trim().length >= 10);
  if (validMobiles.length === 0) return;

  try {
    const response = await fetch('https://api.sms.ir/v1/send/bulk', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SMS_API_KEY || 'LzBMfwWGgOz0ugQHHejPsWFMvWkEaZkyEdsZv6C8TpsoKy1x',
        'Content-Type': 'application/json',
        'ACCEPT': 'application/json'
      },
      body: JSON.stringify({
        lineNumber: Number(process.env.SMS_LINE_NUMBER || 300000000000),
        messageText,
        mobiles: validMobiles,
        sendDateTime: null
      })
    });
    const data = await response.json();
    console.log('SMS sent:', data);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
}

function getMobilesByRole(role: string): string[] {
  return USERS.filter(u => u.role === role || u.role === 'admin').map(u => u.mobile).filter(Boolean) as string[];
}

function getUserMobile(id: number): string[] {
  const u = USERS.find(u => u.id === id);
  return u && u.mobile ? [u.mobile] : [];
}
"""

content = content.replace("let reqItemCounter = 1;", "let reqItemCounter = 1;\n" + sms_helper)

# Update initial users with mobile field
content = re.sub(
    r"{ id: 1, name: 'مدیر سیستم', username: 'admin', password: 'password', role: 'admin' }",
    r"{ id: 1, name: 'مدیر سیستم', username: 'admin', password: 'password', role: 'admin', mobile: '' }",
    content
)
content = re.sub(
    r"{ id: 2, name: 'رضا احمدی', username: 'reza', password: 'password', role: 'requester' }",
    r"{ id: 2, name: 'رضا احمدی', username: 'reza', password: 'password', role: 'requester', mobile: '' }",
    content
)
content = re.sub(
    r"{ id: 3, name: 'حسن سرپرست', username: 'hasan', password: 'password', role: 'supervisor' }",
    r"{ id: 3, name: 'حسن سرپرست', username: 'hasan', password: 'password', role: 'supervisor', mobile: '' }",
    content
)
content = re.sub(
    r"{ id: 4, name: 'مریم انباردار', username: 'maryam', password: 'password', role: 'storekeeper' }",
    r"{ id: 4, name: 'مریم انباردار', username: 'maryam', password: 'password', role: 'storekeeper', mobile: '' }",
    content
)
content = re.sub(
    r"{ id: 5, name: 'سینا خریدار', username: 'sina', password: 'password', role: 'purchaser' }",
    r"{ id: 5, name: 'سینا خریدار', username: 'sina', password: 'password', role: 'purchaser', mobile: '' }",
    content
)

# Fix user POST/PUT endpoints to save mobile
content = re.sub(
    r"const { username, name, password, role, department } = req\.body;",
    r"const { username, name, password, role, department, mobile } = req.body;",
    content
)

content = re.sub(
    r"USERS\.push\({ id: newId, username, name, password, role, department }\);",
    r"USERS.push({ id: newId, username, name, password, role, department, mobile });",
    content
)

content = re.sub(
    r"user\.department = department;",
    r"user.department = department;\n      user.mobile = mobile;",
    content
)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
