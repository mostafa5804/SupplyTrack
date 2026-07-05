import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Default templates
templates = """smsTemplates: {
    req_submitted_requester: "SupplyTrack\\nدرخواست جدید شما با شماره {{id}} ثبت شد و در انتظار تایید سرپرست است.",
    req_submitted_supervisor: "SupplyTrack\\nدرخواست جدید شماره {{id}} توسط {{user}} ثبت شد و نیازمند بررسی شماست.",
    req_approved_requester: "SupplyTrack\\nدرخواست شماره {{id}} شما توسط سرپرست تایید شد.",
    req_approved_storekeeper: "SupplyTrack\\nدرخواست شماره {{id}} جهت بررسی موجودی انبار به کارتابل شما افزوده شد.",
    req_rejected_requester: "SupplyTrack\\nدرخواست شماره {{id}} شما توسط سرپرست رد شد.",
    req_shortage_purchaser: "SupplyTrack\\nبرای درخواست شماره {{id}} کسری انبار ثبت شد و نیازمند خرید اقلام است.",
    req_wh_supplied_requester: "SupplyTrack\\nتأمین از انبار برای درخواست شماره {{id}} انجام شد و هم‌اکنون آماده تحویل می‌باشد.",
    req_delivered_requester: "SupplyTrack\\nاقلام درخواست شماره {{id}} به شما تحویل داده شد.",
    req_purchased_supervisor: "SupplyTrack\\nکالاهای مربوط به درخواست شماره {{id}} خریداری شده و به انبار تحویل داده شد.",
    req_purchased_requester: "SupplyTrack\\nکالاهای درخواستی شما برای شماره {{id}} خریداری شده و در انبار آماده تحویل است."
  }"""

if 'smsTemplates:' not in content:
    content = content.replace("logoUrl: ''", "logoUrl: '',\n  " + templates)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
