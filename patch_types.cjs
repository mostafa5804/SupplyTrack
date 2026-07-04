const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(/buyQty: number;/, "buyQty: number;\n  purchasedQty?: number;\n  deliveredQty?: number;");
content = content.replace(/'completed' \| 'rejected';/, "'completed' | 'rejected' | 'pending_delivery' | 'partial_purchase' | 'partial_delivery' | 'pending_purchase';");
fs.writeFileSync('src/types.ts', content);
