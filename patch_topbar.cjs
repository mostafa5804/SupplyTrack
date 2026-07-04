const fs = require('fs');
let content = fs.readFileSync('src/components/Topbar.tsx', 'utf8');
content = content.replace(/<button\s*onClick=\{onMenuClick\}\s*className="lg:hidden p-2 -mr-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"\s*>\s*<Menu size=\{24\} \/>\s*<\/button>/, '');
fs.writeFileSync('src/components/Topbar.tsx', content);
