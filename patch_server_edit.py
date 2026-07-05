import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

edit_old = """    request.items = items.map((it: any) => ({
      id: it.id || reqItemCounter++,
      itemName: it.itemName,
      unit: it.unit,
      description: it.description || '',
      reqQty: it.qty || it.reqQty,
      supQty: 0,
      whQty: 0,
      buyQty: 0
    }));
    request.logs.push({
      id: logCounter++,
      user: req.user.name,
      date: farsiDate() + ' ' + farsiTime(),
      action: 'ویرایش درخواست',
      icon: '✏️'
    });"""

edit_new = """    items.forEach((newItem: any) => {
      if (newItem.id) {
        const oldItem = request.items.find((it: any) => it.id === newItem.id);
        const newQty = newItem.qty || newItem.reqQty;
        if (oldItem && newQty !== oldItem.reqQty) {
          request.logs.push({
            id: logCounter++,
            user: req.user.name,
            date: farsiDate() + ' ' + farsiTime(),
            action: `ویرایش مقدار درخواستی "${newItem.itemName}" از ${oldItem.reqQty} به ${newQty} ${newItem.unit}`,
            icon: '✏️'
          });
        }
      }
    });

    request.items = items.map((it: any) => ({
      id: it.id || reqItemCounter++,
      itemName: it.itemName,
      unit: it.unit,
      description: it.description || '',
      reqQty: it.qty || it.reqQty,
      supQty: 0,
      whQty: 0,
      buyQty: 0
    }));
    request.logs.push({
      id: logCounter++,
      user: req.user.name,
      date: farsiDate() + ' ' + farsiTime(),
      action: 'ویرایش درخواست',
      icon: '✏️'
    });"""

content = content.replace(edit_old, edit_new)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
