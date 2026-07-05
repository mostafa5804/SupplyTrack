import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add validation check to POST /api/users
content = content.replace(
    "if (USERS.find(u => u.username === username)) return res.status(400).json({ message: 'نام کاربری تکراری است' });",
    """if (USERS.find(u => u.username === username)) return res.status(400).json({ message: 'نام کاربری تکراری است' });
    if (mobile && !/^(09|\\+989)\\d{9}$/.test(mobile.replace(/\\s/g, ''))) return res.status(400).json({ message: 'شماره موبایل باید با 09 یا 98+ شروع شده و معتبر باشد.' });"""
)

# Add validation check to PUT /api/users/:id
content = content.replace(
    "if (username !== user.username && USERS.find(u => u.username === username)) return res.status(400).json({ message: 'نام کاربری تکراری است' });",
    """if (username !== user.username && USERS.find(u => u.username === username)) return res.status(400).json({ message: 'نام کاربری تکراری است' });
    if (mobile && !/^(09|\\+989)\\d{9}$/.test(mobile.replace(/\\s/g, ''))) return res.status(400).json({ message: 'شماره موبایل باید با 09 یا 98+ شروع شده و معتبر باشد.' });"""
)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
