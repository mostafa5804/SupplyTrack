import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

supervisor_logic_old = """    if (action === 'approve') {
      request.status = 'warehouse_check';
      request.items = items; // updated items with supQty
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تأیید سرپرست',
        icon: '✅',
        comment
      });"""

supervisor_logic_new = """    if (action === 'approve') {
      // Check for quantity modifications
      items.forEach((newItem: any) => {
        const oldItem = request.items.find((it: any) => it.id === newItem.id);
        if (oldItem && newItem.supQty !== oldItem.reqQty) {
          request.logs.push({
            id: logCounter++,
            user: req.user.name,
            date: farsiDate() + ' ' + farsiTime(),
            action: `ویرایش مقدار تایید شده "${newItem.itemName}" از ${oldItem.reqQty} به ${newItem.supQty} ${newItem.unit}`,
            icon: '✏️'
          });
        }
      });
      request.status = 'warehouse_check';
      request.items = items; // updated items with supQty
      request.logs.push({
        id: logCounter++,
        user: req.user.name,
        date: farsiDate() + ' ' + farsiTime(),
        action: 'تأیید سرپرست',
        icon: '✅',
        comment
      });"""

content = content.replace(supervisor_logic_old, supervisor_logic_new)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
