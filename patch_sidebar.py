import re

with open('src/components/Sidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('to="/help"', 'to="/about"')
content = content.replace('راهنمای استفاده', 'درباره برنامه')

with open('src/components/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
