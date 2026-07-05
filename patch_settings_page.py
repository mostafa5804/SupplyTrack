import re

with open('src/pages/Settings.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

initial_form = """  const [formData, setFormData] = useState({
    projectName: '',
    companyName: '',
    logoUrl: '',
    smsEnabled: false,
    smsApiKey: '',
    smsLineNumber: '',
    smsNotifyRequester: true,
    smsNotifySupervisor: true,
    smsNotifyStorekeeper: true,
    smsNotifyPurchaser: true
  });"""

content = re.sub(
    r"const \[formData, setFormData\] = useState\(\{[\s\S]*?logoUrl:\s*''\s*\}\);",
    initial_form,
    content
)

sms_section = """
        <div className="pt-6 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground">تنظیمات پنل پیامکی (SMS)</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-semibold">فعال‌سازی ارسال پیامک</span>
              <input 
                type="checkbox" 
                checked={formData.smsEnabled || false} 
                onChange={e => setFormData({...formData, smsEnabled: e.target.checked})}
                className="w-4 h-4 accent-primary"
              />
            </label>
          </div>
          
          {formData.smsEnabled && (
            <div className="space-y-4 bg-secondary/20 p-4 rounded-xl border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-foreground">API Key (SMS.ir)</label>
                  <input 
                    type="text" 
                    value={formData.smsApiKey || ''} 
                    onChange={e => setFormData({...formData, smsApiKey: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-left"
                    dir="ltr"
                    placeholder="LzBMfwWGgOz0ugQH..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-foreground">شماره خط اختصاصی</label>
                  <input 
                    type="text" 
                    value={formData.smsLineNumber || ''} 
                    onChange={e => setFormData({...formData, smsLineNumber: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-left"
                    dir="ltr"
                    placeholder="3000..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-3 text-foreground mt-2">ارسال پیامک برای نقش‌های زیر فعال باشد:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-background p-2 rounded-lg border border-border">
                    <input 
                      type="checkbox" 
                      checked={formData.smsNotifyRequester !== false} 
                      onChange={e => setFormData({...formData, smsNotifyRequester: e.target.checked})}
                      className="accent-primary"
                    />
                    <span className="text-xs font-semibold">درخواست‌کننده</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-background p-2 rounded-lg border border-border">
                    <input 
                      type="checkbox" 
                      checked={formData.smsNotifySupervisor !== false} 
                      onChange={e => setFormData({...formData, smsNotifySupervisor: e.target.checked})}
                      className="accent-primary"
                    />
                    <span className="text-xs font-semibold">سرپرست</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-background p-2 rounded-lg border border-border">
                    <input 
                      type="checkbox" 
                      checked={formData.smsNotifyStorekeeper !== false} 
                      onChange={e => setFormData({...formData, smsNotifyStorekeeper: e.target.checked})}
                      className="accent-primary"
                    />
                    <span className="text-xs font-semibold">انباردار</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-background p-2 rounded-lg border border-border">
                    <input 
                      type="checkbox" 
                      checked={formData.smsNotifyPurchaser !== false} 
                      onChange={e => setFormData({...formData, smsNotifyPurchaser: e.target.checked})}
                      className="accent-primary"
                    />
                    <span className="text-xs font-semibold">مامور خرید</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
"""

content = content.replace(
    '<div className="pt-4 border-t border-border flex justify-between">',
    sms_section + '\n        <div className="pt-4 border-t border-border flex justify-between">'
)

with open('src/pages/Settings.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
