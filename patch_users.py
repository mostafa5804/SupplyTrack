import re

with open('src/pages/Users.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add mobile to initial state
content = content.replace("department: ''", "department: '',\n    mobile: ''")

# Add mobile to table headers
content = content.replace('<th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">نقش</th>', '<th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">شماره موبایل</th>\n                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">نقش</th>')

# Add mobile to table rows
content = content.replace('<td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 whitespace-nowrap">', '<td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 font-mono text-muted-foreground whitespace-nowrap">{u.mobile || \'—\'}</td>\n                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 whitespace-nowrap">', 1)

# Add mobile to modal form
form_input = """              <div>
                <label className="block text-xs font-bold mb-1.5">شماره موبایل</label>
                <input type="text" value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-left" dir="ltr" placeholder="09xxxxxxxxx" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">نقش</label>"""

content = content.replace("""              <div>
                <label className="block text-xs font-bold mb-1.5">نقش</label>""", form_input)

with open('src/pages/Users.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
