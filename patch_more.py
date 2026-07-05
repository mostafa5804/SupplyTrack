import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# PUT /api/requests/:id/supervisor (Approve)
content = re.sub(
    r"action: 'تأیید سرپرست',\s+icon: '✅',\s+comment\s+\}\);\s+res\.json\(request\);",
    r"""action: 'تأیید سرپرست',
        icon: '✅',
        comment
      });
      
      const requesterMobiles = getUserMobile(request.requesterId);
      const storekeeperMobiles = getMobilesByRole('storekeeper');
      
      sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست تایید شد.`);
      sendSms(storekeeperMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} جهت بررسی موجودی انبار به کارتابل شما افزوده شد.`);
      
      res.json(request);""",
    content
)

# PUT /api/requests/:id/supervisor (Reject)
content = re.sub(
    r"action: 'رد درخواست توسط سرپرست',\s+icon: '❌',\s+comment\s+\}\);\s+res\.json\(request\);",
    r"""action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
      
      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست رد شد.`);
      
      res.json(request);""",
    content
)

# PUT /api/requests/:id/warehouse (Check)
content = re.sub(
    r"request\.status = allDelivered \? 'completed' : \(needsPurchase \? 'purchase_list' : 'pending_delivery'\);\s+res\.json\(request\);",
    r"""request.status = allDelivered ? 'completed' : (needsPurchase ? 'purchase_list' : 'pending_delivery');
      
      if (needsPurchase) {
        const purchaserMobiles = getMobilesByRole('purchaser');
        sendSms(purchaserMobiles, `SupplyTrack\\nبرای درخواست شماره ${request.id} کسری انبار ثبت شد و نیازمند خرید اقلام است.`);
      }
      
      if (items.some((it: any) => it.whQty > 0)) {
        const requesterMobiles = getUserMobile(request.requesterId);
        sendSms(requesterMobiles, `SupplyTrack\\nتأمین از انبار برای درخواست شماره ${request.id} انجام شد و هم‌اکنون آماده تحویل می‌باشد.`);
      }
      
      res.json(request);""",
    content
)

# PUT /api/requests/:id/warehouse (Deliver)
content = re.sub(
    r"request\.status = \(request\.status === 'purchase_list' \|\| request\.status === 'partial_purchase'\)\s+\?\s+'partial_purchase'\s+:\s+\(isComplete \? 'completed' : 'partial_delivery'\);\s+res\.json\(request\);",
    r"""request.status = (request.status === 'purchase_list' || request.status === 'partial_purchase') 
        ? 'partial_purchase' 
        : (isComplete ? 'completed' : 'partial_delivery');

      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`);

      res.json(request);""",
    content
)

# PUT /api/requests/:id/purchase
content = re.sub(
    r"request\.status = isComplete \? 'completed' : 'pending_delivery';\s+res\.json\(request\);",
    r"""request.status = isComplete ? 'completed' : 'pending_delivery';
    
    const supervisorMobiles = getMobilesByRole('supervisor');
    const requesterMobiles = getUserMobile(request.requesterId);
    
    sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`);
    sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`);
    
    res.json(request);""",
    content
)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
