with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Since we want to be exact, let's just replace the body of the routes.
import re
content = re.sub(
    r"const \{ name, username, password, role, department \} = req\.body;",
    r"const { name, username, password, role, department, mobile } = req.body;",
    content
)

content = re.sub(
    r"user\.department = department;\s*user\.mobile = mobile;",
    r"user.department = department;\n    user.mobile = mobile || '';",
    content
)

content = re.sub(
    r"department\n\s*};\n\s*USERS\.push\(newUser\);",
    r"department,\n      mobile: mobile || ''\n    };\n    USERS.push(newUser);",
    content
)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
