import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "res.json(USERS.map(u => ({ id: u.id, name: u.name, username: u.username, role: u.role, department: u.department })));",
    "res.json(USERS.map(u => ({ id: u.id, name: u.name, username: u.username, role: u.role, department: u.department, mobile: u.mobile || '' })));"
)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
