import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. POST /api/requests
content = content.replace(
    "REQUESTS.push(newReq);\n    res.json(newReq);",
    """REQUESTS.push(newReq);
    
    const requesterMobiles = getUserMobile(req.user.id);
    const supervisorMobiles = getMobilesByRole('supervisor');
    
    sendSms(requesterMobiles, `SupplyTrack\\nدرخواست جدید شما با شماره ${newReq.id} ثبت شد و در انتظار تایید سرپرست است.`);
    sendSms(supervisorMobiles, `SupplyTrack\\nدرخواست جدید شماره ${newReq.id} توسط ${req.user.name} ثبت شد و نیازمند بررسی شماست.`);
    
    res.json(newReq);"""
)

# 2. PUT /api/requests/:id/supervisor (Approve)
# Need to find the exact block
supervisor_approve = """      request.status = 'warehouse_check';
      request.items = items; // updated items with supQty
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تأیید سرپرست',
        icon: '✅',
        comment
      });
      res.json(request);"""
      
supervisor_approve_new = """      request.status = 'warehouse_check';
      request.items = items; // updated items with supQty
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تأیید سرپرست',
        icon: '✅',
        comment
      });
      
      const requesterMobiles = getUserMobile(request.requesterId);
      const storekeeperMobiles = getMobilesByRole('storekeeper');
      
      sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست تایید شد.`);
      sendSms(storekeeperMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} جهت بررسی موجودی انبار به کارتابل شما افزوده شد.`);
      
      res.json(request);"""

content = content.replace(supervisor_approve, supervisor_approve_new)

# 3. PUT /api/requests/:id/supervisor (Reject)
supervisor_reject = """        action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
      res.json(request);"""

supervisor_reject_new = """        action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
      
      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست رد شد.`);
      
      res.json(request);"""

content = content.replace(supervisor_reject, supervisor_reject_new)

# 4. PUT /api/requests/:id/warehouse (Check)
wh_check = """      request.status = allDelivered ? 'completed' : (needsPurchase ? 'purchase_list' : 'pending_delivery');
      
      res.json(request);"""

wh_check_new = """      request.status = allDelivered ? 'completed' : (needsPurchase ? 'purchase_list' : 'pending_delivery');
      
      if (needsPurchase) {
        const purchaserMobiles = getMobilesByRole('purchaser');
        sendSms(purchaserMobiles, `SupplyTrack\\nبرای درخواست شماره ${request.id} کسری انبار ثبت شد و نیازمند خرید اقلام است.`);
      }
      
      if (items.some((it: any) => it.whQty > 0)) {
        const requesterMobiles = getUserMobile(request.requesterId);
        sendSms(requesterMobiles, `SupplyTrack\\nتأمین از انبار برای درخواست شماره ${request.id} انجام شد و هم‌اکنون آماده تحویل می‌باشد.`);
      }
      
      res.json(request);"""
      
content = content.replace(wh_check, wh_check_new)

# 5. PUT /api/requests/:id/warehouse (Deliver)
wh_deliver = """      request.status = (request.status === 'purchase_list' || request.status === 'partial_purchase') 
        ? 'partial_purchase' 
        : (isComplete ? 'completed' : 'partial_delivery');

      res.json(request);"""

wh_deliver_new = """      request.status = (request.status === 'purchase_list' || request.status === 'partial_purchase') 
        ? 'partial_purchase' 
        : (isComplete ? 'completed' : 'partial_delivery');

      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`);

      res.json(request);"""
      
content = content.replace(wh_deliver, wh_deliver_new)

# 6. PUT /api/requests/:id/purchase
purchase = """    request.status = isComplete ? 'completed' : 'pending_delivery';
    
    res.json(request);"""

purchase_new = """    request.status = isComplete ? 'completed' : 'pending_delivery';
    
    const supervisorMobiles = getMobilesByRole('supervisor');
    const requesterMobiles = getUserMobile(request.requesterId);
    
    sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`);
    sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`);
    
    res.json(request);"""
    
content = content.replace(purchase, purchase_new)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
