import re
import os

def replace_in_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replacements = [
    (
        "{item?.reqQty || ''}",
        "{item?.reqQty ? farsiNum(item.reqQty) : ''}"
    ),
    (
        "{it.reqQty}",
        "{farsiNum(it.reqQty || 0)}"
    ),
    (
        "{it.supQty}",
        "{farsiNum(it.supQty || 0)}"
    )
]

replace_in_file('src/components/RequestDetailsModal.tsx', replacements)
print("Done")
