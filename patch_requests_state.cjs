const fs = require('fs');
let content = fs.readFileSync('src/pages/Requests.tsx', 'utf8');
content = content.replace("import { useAuth } from '../store/AuthContext';", "import { useAuth } from '../store/AuthContext';\nimport { useLocation, useNavigate } from 'react-router-dom';");
content = content.replace("const { user } = useAuth();", "const { user } = useAuth();\n  const location = useLocation();\n  const navigate = useNavigate();");
const hook = `  useEffect(() => {
    fetchData();
    if (location.state?.openNew) {
      setSelectedReq(null);
      setNewReqItems([{ id: 0, itemName: '', unit: '', qty: 1, description: '' }]);
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);`;
content = content.replace(/  useEffect\(\(\) => \{\s*fetchData\(\);\s*\}, \[\]\);/, hook);
fs.writeFileSync('src/pages/Requests.tsx', content);
