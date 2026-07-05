import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace sendSms calls with template usage
# Instead of hardcoded strings, we will use SETTINGS.smsTemplates

# Helper to inject templates
helper = """
function getSmsMessage(templateKey: string, variables: { id?: number, user?: string }): string {
  if (!SETTINGS.smsTemplates) return '';
  let template = SETTINGS.smsTemplates[templateKey] || '';
  if (variables.id) template = template.replace(/\\{\\{id\\}\\}/g, variables.id.toString());
  if (variables.user) template = template.replace(/\\{\\{user\\}\\}/g, variables.user);
  return template;
}
"""

if 'function getSmsMessage' not in content:
    content = content.replace("async function sendSms(", helper + "\nasync function sendSms(")

# POST /api/requests
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست جدید شما با شماره ${newReq.id} ثبت شد و در انتظار تایید سرپرست است.`, 'requester');",
    "sendSms(requesterMobiles, getSmsMessage('req_submitted_requester', { id: newReq.id }), 'requester');"
)
content = content.replace(
    "sendSms(supervisorMobiles, `SupplyTrack\\nدرخواست جدید شماره ${newReq.id} توسط ${req.user.name} ثبت شد و نیازمند بررسی شماست.`, 'supervisor');",
    "sendSms(supervisorMobiles, getSmsMessage('req_submitted_supervisor', { id: newReq.id, user: req.user.name }), 'supervisor');"
)

# PUT /api/requests/:id/supervisor (Approve)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست تایید شد.`, 'requester');",
    "sendSms(requesterMobiles, getSmsMessage('req_approved_requester', { id: request.id }), 'requester');"
)
content = content.replace(
    "sendSms(storekeeperMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} جهت بررسی موجودی انبار به کارتابل شما افزوده شد.`, 'storekeeper');",
    "sendSms(storekeeperMobiles, getSmsMessage('req_approved_storekeeper', { id: request.id }), 'storekeeper');"
)

# PUT /api/requests/:id/supervisor (Reject)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست رد شد.`, 'requester');",
    "sendSms(requesterMobiles, getSmsMessage('req_rejected_requester', { id: request.id }), 'requester');"
)

# PUT /api/requests/:id/warehouse (Check)
content = content.replace(
    "sendSms(purchaserMobiles, `SupplyTrack\\nبرای درخواست شماره ${request.id} کسری انبار ثبت شد و نیازمند خرید اقلام است.`, 'purchaser');",
    "sendSms(purchaserMobiles, getSmsMessage('req_shortage_purchaser', { id: request.id }), 'purchaser');"
)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nتأمین از انبار برای درخواست شماره ${request.id} انجام شد و هم‌اکنون آماده تحویل می‌باشد.`, 'requester');",
    "sendSms(requesterMobiles, getSmsMessage('req_wh_supplied_requester', { id: request.id }), 'requester');"
)

# PUT /api/requests/:id/deliver
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`, 'requester');",
    "sendSms(requesterMobiles, getSmsMessage('req_delivered_requester', { id: request.id }), 'requester');"
)

# PUT /api/requests/:id/purchase
content = content.replace(
    "sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`, 'supervisor');",
    "sendSms(supervisorMobiles, getSmsMessage('req_purchased_supervisor', { id: request.id }), 'supervisor');"
)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`, 'requester');",
    "sendSms(requesterMobiles, getSmsMessage('req_purchased_requester', { id: request.id }), 'requester');"
)

# PUT /api/purchase
content = content.replace(
    "sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${r.id} خریداری شده و به انبار تحویل داده شد.`, 'supervisor');",
    "sendSms(supervisorMobiles, getSmsMessage('req_purchased_supervisor', { id: r.id }), 'supervisor');"
)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${r.id} خریداری شده و در انبار آماده تحویل است.`, 'requester');",
    "sendSms(requesterMobiles, getSmsMessage('req_purchased_requester', { id: r.id }), 'requester');"
)


with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
