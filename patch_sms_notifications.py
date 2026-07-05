import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. POST /api/requests
post_req_old = """    REQUESTS.push(newRequest);
    res.status(201).json(newRequest);"""

post_req_new = """    REQUESTS.push(newRequest);
    
    const requesterMobiles = getUserMobile(req.user.id);
    const supervisorMobiles = getMobilesByRole('supervisor');
    
    sendSms(requesterMobiles, `SupplyTrack\\nدرخواست جدید شما با شماره ${newRequest.id} ثبت شد و در انتظار تایید سرپرست است.`);
    sendSms(supervisorMobiles, `SupplyTrack\\nدرخواست جدید شماره ${newRequest.id} توسط ${req.user.name} ثبت شد و نیازمند بررسی شماست.`);
    
    res.status(201).json(newRequest);"""
content = content.replace(post_req_old, post_req_new)


# 2. PUT /api/requests/:id/supervisor (Approve)
approve_old = """      request.status = 'warehouse_check';
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

approve_new = """      request.status = 'warehouse_check';
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
content = content.replace(approve_old, approve_new)


# 3. PUT /api/requests/:id/supervisor (Reject)
reject_old = """    } else if (action === 'reject') {
      request.status = 'rejected';
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
      res.json(request);"""

reject_new = """    } else if (action === 'reject') {
      request.status = 'rejected';
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
      
      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست رد شد.`);
      
      res.json(request);"""
content = content.replace(reject_old, reject_new)


# 4. PUT /api/requests/:id/warehouse (Check)
wh_check_old = """      request.status = allDelivered ? 'completed' : (needsPurchase ? 'purchase_list' : 'pending_delivery');
      
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
content = content.replace(wh_check_old, wh_check_new)


# 5. PUT /api/requests/:id/warehouse (Deliver)
wh_deliver_old = """      request.status = (request.status === 'purchase_list' || request.status === 'partial_purchase') 
        ? 'partial_purchase' 
        : (isComplete ? 'completed' : 'partial_delivery');

      res.json(request);"""

wh_deliver_new = """      request.status = (request.status === 'purchase_list' || request.status === 'partial_purchase') 
        ? 'partial_purchase' 
        : (isComplete ? 'completed' : 'partial_delivery');

      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`);

      res.json(request);"""
content = content.replace(wh_deliver_old, wh_deliver_new)


# 6. PUT /api/requests/:id/purchase
purchase_old = """    request.status = isComplete ? 'completed' : 'pending_delivery';
    
    res.json(request);"""

purchase_new = """    request.status = isComplete ? 'completed' : 'pending_delivery';
    
    const supervisorMobiles = getMobilesByRole('supervisor');
    const requesterMobiles = getUserMobile(request.requesterId);
    
    sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`);
    sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`);
    
    res.json(request);"""
content = content.replace(purchase_old, purchase_new)


with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
