import re

with open('src/pages/Users.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

submit_old = """  const handleSubmit = async () => {
    if (!formData.name || !formData.username || !formData.role) return alert('لطفا فیلدهای ضروری را پر کنید');"""

submit_new = """  const handleSubmit = async () => {
    if (!formData.name || !formData.username || !formData.role) return alert('لطفا فیلدهای ضروری را پر کنید');
    if (formData.mobile) {
      const mobileClean = formData.mobile.replace(/\\s/g, '');
      if (!/^(09|\\+989)\\d{9}$/.test(mobileClean)) {
        return alert('شماره موبایل نامعتبر است. فرمت صحیح: 09123456789 یا 989123456789+');
      }
    }"""

content = content.replace(submit_old, submit_new)

input_old = """              <div>
                <label className="block text-xs font-bold mb-1.5">شماره موبایل</label>
                <input type="text" value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-left" dir="ltr" placeholder="09xxxxxxxxx" />
              </div>"""

input_new = """              <div>
                <label className="block text-xs font-bold mb-1.5">شماره موبایل <span className="text-muted-foreground font-normal text-[10px]">(09 یا 98+)</span></label>
                <input type="text" value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary text-left" dir="ltr" placeholder="09123456789" />
              </div>"""

content = content.replace(input_old, input_new)

with open('src/pages/Users.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
