const fs = require('fs');
let content = fs.readFileSync('src/lib/utils.ts', 'utf8');

content = content.replace(
  "purchase_list:         { label: 'در لیست خرید',     icon: '🛒', cls: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400' },",
  `purchase_list:         { label: 'در لیست خرید',     icon: '🛒', cls: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400' },
  partial_purchase:      { label: 'خرید ناقص',        icon: '🛍️', cls: 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-400' },`
);

content = content.replace(
  "pending_delivery:      { label: 'آماده تحویل',       icon: '🎁', cls: 'bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-400' },",
  `pending_delivery:      { label: 'آماده تحویل',       icon: '🎁', cls: 'bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-400' },
  partial_delivery:      { label: 'نقص در تحویل',      icon: '⚠️', cls: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400' },`
);

fs.writeFileSync('src/lib/utils.ts', content);
