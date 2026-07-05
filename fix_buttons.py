import re

# For Supervisor.tsx
with open('src/pages/Supervisor.tsx', 'r', encoding='utf-8') as f:
    sup_content = f.read()

# find: <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-4">
sup_content = sup_content.replace(
    '<div className="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-4">',
    '<div className="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-4 sticky bottom-0 bg-card p-4 -mx-4 -mb-4 sm:mx-0 sm:mb-0 sm:p-0 sm:static sm:bg-transparent border-t border-border sm:border-0 z-10">'
)

with open('src/pages/Supervisor.tsx', 'w', encoding='utf-8') as f:
    f.write(sup_content)


# For Warehouse.tsx
with open('src/pages/Warehouse.tsx', 'r', encoding='utf-8') as f:
    wh_content = f.read()

# find: <div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden">
wh_content = wh_content.replace(
    '<div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden">',
    '<div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden sticky bottom-0 z-10">'
)

with open('src/pages/Warehouse.tsx', 'w', encoding='utf-8') as f:
    f.write(wh_content)


# For Purchasing.tsx
with open('src/pages/Purchasing.tsx', 'r', encoding='utf-8') as f:
    pur_content = f.read()

# find: <div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden">
pur_content = pur_content.replace(
    '<div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden">',
    '<div className="p-4 lg:p-6 border-t border-border flex justify-end bg-card print:hidden sticky bottom-0 z-10">'
)

with open('src/pages/Purchasing.tsx', 'w', encoding='utf-8') as f:
    f.write(pur_content)
