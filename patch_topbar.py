import re

with open('src/components/Topbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'/help': 'راهنمای استفاده',", "'/about': 'درباره برنامه',")
content = content.replace("navigate('/help')", "navigate('/about')")
content = content.replace('title="راهنمای استفاده"', 'title="درباره برنامه"')

with open('src/components/Topbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
