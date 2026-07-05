import re

with open('src/pages/Users.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

submit_old = """  const handleSubmit = async () => {
    if (!formData.name || !formData.username || !formData.role) return alert('لطفا فیلدهای ضروری را پر کنید');
    if (formData.mobile) {
      const mobileClean = formData.mobile.replace(/\\s/g, '');
      if (!/^(09|\\+989)\\d{9}$/.test(mobileClean)) {
        return alert('شماره موبایل نامعتبر است. فرمت صحیح: 09123456789 یا 989123456789+');
      }
    }
    
    try {
      if (formData.id) {
        await api.put(`/users/${formData.id}`, formData);
      } else {
        await api.post('/users', formData);
      }"""

submit_new = """  const handleSubmit = async () => {
    if (!formData.name || !formData.username || !formData.role) return alert('لطفا فیلدهای ضروری را پر کنید');
    
    let submitData = { ...formData };
    if (submitData.mobile) {
      submitData.mobile = submitData.mobile.replace(/\\s/g, '');
      if (!/^(09|\\+989)\\d{9}$/.test(submitData.mobile)) {
        return alert('شماره موبایل نامعتبر است. فرمت صحیح: 09123456789 یا 989123456789+');
      }
    }
    
    try {
      if (submitData.id) {
        await api.put(`/users/${submitData.id}`, submitData);
      } else {
        await api.post('/users', submitData);
      }"""

content = content.replace(submit_old, submit_new)

with open('src/pages/Users.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
