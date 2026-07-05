import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# supervisor approve
old1 = """      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تأیید سرپرست',
        icon: '✅',
        comment
      });
    } else if (action === 'reject') {"""
new1 = """      request.logs.push({
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
    } else if (action === 'reject') {"""
content = content.replace(old1, new1)

# supervisor reject
old2 = """      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
    }
    res.json(request);"""
new2 = """      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'رد درخواست توسط سرپرست',
        icon: '❌',
        comment
      });
      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nدرخواست شماره ${request.id} شما توسط سرپرست رد شد.`);
    }
    res.json(request);"""
content = content.replace(old2, new2)

# warehouse check
old3 = """    if (!hasShortage) { 
       request.logs.push({
          id: logCounter++,
          user: req.user.name,
          date: farsiDate() + ' ' + farsiTime(),
          action: 'تحویل نهایی به درخواست‌کننده',
          icon: '🎯'
        });
    }
    res.json(request);"""
new3 = """    if (!hasShortage) { 
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
content = content.replace(old3, new3)

# deliver
old4 = """      request.logs.push({
        id: logCounter++,
        user: req.user.name || 'System',
        date: farsiDate() + ' ' + farsiTime(),
        action: allDelivered ? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
        icon: '🎁'
      });
      saveDB();
      res.json(request);"""
new4 = """      request.logs.push({
        id: logCounter++,
        user: req.user.name || 'System',
        date: farsiDate() + ' ' + farsiTime(),
        action: allDelivered ? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
        icon: '🎁'
      });
      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`);
      saveDB();
      res.json(request);"""
content = content.replace(old4, new4)

# purchase
old5 = """    } else {
      request.status = 'partial_purchase';
    }
    res.json(request);"""
new5 = """    } else {
      request.status = 'partial_purchase';
    }
    if (somePurchased) {
        const supervisorMobiles = getMobilesByRole('supervisor');
        const requesterMobiles = getUserMobile(request.requesterId);
        sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`);
        sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`);
    }
    res.json(request);"""
content = content.replace(old5, new5)


with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
