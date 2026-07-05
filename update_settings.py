import re

with open('src/pages/Settings.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = """  const handleSubmit = async () => {
    try {
      await api.put('/settings', formData);
      alert('تنظیمات با موفقیت ذخیره شد');
      refreshSettings();
    } catch (e) {
      alert('خطا در ذخیره تنظیمات');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('⚠️ اخطار: آیا از پاک کردن تمام اطلاعات (درخواست‌ها، تاریخچه و ...) اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
      try {
        await api.post('/reset');
        alert('تمام اطلاعات سیستم با موفقیت پاک شد.');
        window.location.reload();
      } catch (e) {
        alert('خطا در پاک کردن اطلاعات');
      }
    }
  };"""

content = content.replace("""  const handleSubmit = async () => {
    try {
      await api.put('/settings', formData);
      alert('تنظیمات با موفقیت ذخیره شد');
      refreshSettings();
    } catch (e) {
      alert('خطا در ذخیره تنظیمات');
    }
  };""", new_logic)

new_ui = """        <div className="pt-4 border-t border-border flex justify-between">
          <button onClick={handleResetData} className="bg-destructive/10 hover:bg-destructive text-destructive hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            🗑️ پاکسازی کل اطلاعات
          </button>
          <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            <Save size={18} /> ذخیره تنظیمات
          </button>
        </div>"""

content = content.replace("""        <div className="pt-4 border-t border-border flex justify-end">
          <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            <Save size={18} /> ذخیره تنظیمات
          </button>
        </div>""", new_ui)

with open('src/pages/Settings.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
