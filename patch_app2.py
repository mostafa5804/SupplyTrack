import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Help } from './pages/Help';\n", "")
content = content.replace('<Route path="/help" element={<Help />} />\n', "")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
