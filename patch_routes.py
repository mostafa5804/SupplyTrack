import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()


# PUT /api/requests/:id/warehouse
wh_old = """    if (!hasShortage) { 
       request.logs.push({
          id: logCounter++,
          user: req.user.name,
          date: farsiDate() + ' ' + farsiTime(),
          action: 'تحویل نهایی به درخواست‌کننده',
          icon: '🎯'
        });
    }
    res.json(request);"""

wh_new = """    if (!hasShortage) { 
       request.logs.push({
          id: logCounter++,
          user: req.user.name,
          date: farsiDate() + ' ' + farsiTime(),
          action: 'تحویل نهایی به درخواست‌کننده',
          icon: '🎯'
        });
    }
    
    if (hasShortage) {
        const purchaserMobiles = getMobilesByRole('purchaser');
        sendSms(purchaserMobiles, `SupplyTrack\\nبرای درخواست شماره ${request.id} کسری انبار ثبت شد و نیازمند خرید اقلام است.`);
    }
    
    if (request.items.some((it: any) => it.whQty > 0)) {
        const requesterMobiles = getUserMobile(request.requesterId);
        sendSms(requesterMobiles, `SupplyTrack\\nتأمین از انبار برای درخواست شماره ${request.id} انجام شد و هم‌اکنون آماده تحویل می‌باشد.`);
    }
    
    res.json(request);"""

content = content.replace(wh_old, wh_new)

# PUT /api/requests/:id/deliver
deliver_old = """        action: allDelivered ? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
        icon: '🎁'
      });
      
      saveDB();
      res.json(request);"""

deliver_new = """        action: allDelivered ? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
        icon: '🎁'
      });
      
      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`);
      
      saveDB();
      res.json(request);"""

content = content.replace(deliver_old, deliver_new)

# PUT /api/requests/:id/purchase
purchase_old = """    } else {
      request.status = 'partial_purchase';
    }
    res.json(request);"""

purchase_new = """    } else {
      request.status = 'partial_purchase';
    }
    
    if (somePurchased) {
        const supervisorMobiles = getMobilesByRole('supervisor');
        const requesterMobiles = getUserMobile(request.requesterId);
        
        sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`);
        sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`);
    }
    
    res.json(request);"""

content = content.replace(purchase_old, purchase_new)


with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
