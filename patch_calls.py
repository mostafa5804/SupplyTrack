import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# POST /api/requests
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست جدید شما با شماره ${newReq.id} ثبت شد و در انتظار تایید سرپرست است.`);\n    sendSms(supervisorMobiles, `SupplyTrack\\nدرخواست جدید شماره ${newReq.id} توسط ${req.user.name} ثبت شد و نیازمند بررسی شماست.`);",
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست جدید شما با شماره ${newReq.id} ثبت شد و در انتظار تایید سرپرست است.`, 'requester');\n    sendSms(supervisorMobiles, `SupplyTrack\\nدرخواست جدید شماره ${newReq.id} توسط ${req.user.name} ثبت شد و نیازمند بررسی شماست.`, 'supervisor');"
)

# PUT /api/requests/:id/supervisor (Approve)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست تایید شد.`);\n      sendSms(storekeeperMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} جهت بررسی موجودی انبار به کارتابل شما افزوده شد.`);",
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست تایید شد.`, 'requester');\n      sendSms(storekeeperMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} جهت بررسی موجودی انبار به کارتابل شما افزوده شد.`, 'storekeeper');"
)

# PUT /api/requests/:id/supervisor (Reject)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست رد شد.`);",
    "sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست رد شد.`, 'requester');"
)

# PUT /api/requests/:id/warehouse (Check)
content = content.replace(
    "sendSms(purchaserMobiles, `SupplyTrack\\nبرای درخواست شماره ${request.id} کسری انبار ثبت شد و نیازمند خرید اقلام است.`);",
    "sendSms(purchaserMobiles, `SupplyTrack\\nبرای درخواست شماره ${request.id} کسری انبار ثبت شد و نیازمند خرید اقلام است.`, 'purchaser');"
)
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nتأمین از انبار برای درخواست شماره ${request.id} انجام شد و هم‌اکنون آماده تحویل می‌باشد.`);",
    "sendSms(requesterMobiles, `SupplyTrack\\nتأمین از انبار برای درخواست شماره ${request.id} انجام شد و هم‌اکنون آماده تحویل می‌باشد.`, 'requester');"
)

# PUT /api/requests/:id/deliver
content = content.replace(
    "sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`);",
    "sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`, 'requester');"
)

# PUT /api/requests/:id/purchase
content = content.replace(
    "sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`);\n        sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`);",
    "sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`, 'supervisor');\n        sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`, 'requester');"
)

# PUT /api/purchase
content = content.replace(
    "sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${r.id} خریداری شده و به انبار تحویل داده شد.`);\n      sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${r.id} خریداری شده و در انبار آماده تحویل است.`);",
    "sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${r.id} خریداری شده و به انبار تحویل داده شد.`, 'supervisor');\n      sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${r.id} خریداری شده و در انبار آماده تحویل است.`, 'requester');"
)


with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
