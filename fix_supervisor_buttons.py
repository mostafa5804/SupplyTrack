import re

with open('src/pages/Supervisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("✅ تأیید درخواست", "<Check size={16} className=\"ml-1\" /> تأیید درخواست")
content = content.replace("❌ رد درخواست", "<X size={16} className=\"ml-1\" /> رد درخواست")

with open('src/pages/Supervisor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
