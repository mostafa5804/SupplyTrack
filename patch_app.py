import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
content = content.replace("import { Help } from './pages/Help';", "import { Help } from './pages/Help';\nimport { About } from './pages/About';")

# Add Route
content = content.replace('<Route path="/help" element={<Help />} />', '<Route path="/help" element={<Help />} />\n                  <Route path="/about" element={<About />} />')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
