import re

with open('src/pages/Supervisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
content = content.replace("import { Printer } from 'lucide-react';", "import { Printer, Check, X } from 'lucide-react';")

# Fix emojis in lines 156, 159, 203, 204
content = content.replace("✅\n                                  </button>", "<Check size={16} />\n                                  </button>")
content = content.replace("❌\n                                  </button>", "<X size={16} />\n                                  </button>")

content = content.replace(">✅</button>", "><Check size={16} /></button>")
content = content.replace(">❌</button>", "><X size={16} /></button>")

with open('src/pages/Supervisor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
