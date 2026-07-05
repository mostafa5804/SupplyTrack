import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# warehouse check
content = re.sub(
    r"action: 'تحویل نهایی به درخواست‌کننده',\s+icon: '🎯'\s+\}\);\s+\}\s+res\.json\(request\);",
    r"""action: 'تحویل نهایی به درخواست‌کننده',
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
    
    res.json(request);""",
    content
)

# deliver
content = re.sub(
    r"action: allDelivered \? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',\s+icon: '🎁'\s+\}\);\s+saveDB\(\);\s+res\.json\(request\);",
    r"""action: allDelivered ? 'تحویل کامل به درخواست‌کننده' : 'تحویل ناقص به درخواست‌کننده',
        icon: '🎁'
      });
      
      const requesterMobiles = getUserMobile(request.requesterId);
      sendSms(requesterMobiles, `SupplyTrack\\nاقلام درخواست شماره ${request.id} به شما تحویل داده شد.`);
      
      saveDB();
      res.json(request);""",
    content
)

# purchase 1
content = re.sub(
    r"\} else \{\s+request\.status = 'partial_purchase';\s+\}\s+res\.json\(request\);",
    r"""} else {
      request.status = 'partial_purchase';
    }
    
    if (somePurchased) {
        const supervisorMobiles = getMobilesByRole('supervisor');
        const requesterMobiles = getUserMobile(request.requesterId);
        
        sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${request.id} خریداری شده و به انبار تحویل داده شد.`);
        sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${request.id} خریداری شده و در انبار آماده تحویل است.`);
    }
    
    res.json(request);""",
    content
)

# purchase 2 (bulk)
content = re.sub(
    r"action: 'تحویل نهایی به درخواست‌کننده',\s+icon: '🎯'\s+\}\);\s+\}\);\s+res\.json",
    r"""action: 'تحویل نهایی به درخواست‌کننده',
        icon: '🎯'
      });
      
      const supervisorMobiles = getMobilesByRole('supervisor');
      const requesterMobiles = getUserMobile(r.requesterId);
      
      sendSms(supervisorMobiles, `SupplyTrack\\nکالاهای مربوط به درخواست شماره ${r.id} خریداری شده و به انبار تحویل داده شد.`);
      sendSms(requesterMobiles, `SupplyTrack\\nکالاهای درخواستی شما برای شماره ${r.id} خریداری شده و در انبار آماده تحویل است.`);
      
    });
    res.json""",
    content
)


with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
