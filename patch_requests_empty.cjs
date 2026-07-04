const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const emptyRequests = `let REQUESTS: any[] = [];
let requestCounter = 1000;
let logCounter = 1;
let reqItemCounter = 1;`;

content = content.replace(/let REQUESTS: any\[\] = \[[\s\S]*?\];\n\nlet requestCounter = 1003;\nlet logCounter = 6;\nlet reqItemCounter = 5;/, emptyRequests);

fs.writeFileSync('server.ts', content);
