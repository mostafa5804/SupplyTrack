const fs = require('fs');
let content = fs.readFileSync('src/pages/Requests.tsx', 'utf8');
content = content.replace(/  useEffect\(\(\) => \{\s*fetchData\(\);\s*if \(location\.state\?\.openNew\) \{[\s\S]*?\} \}, \[location\.state, navigate\]\);/, `  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.openNew) {
      setSelectedReq(null);
      setNewReqItems([{ id: 0, itemName: '', unit: '', qty: 1, description: '' }]);
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.openNew, navigate, location.pathname]);`);
fs.writeFileSync('src/pages/Requests.tsx', content);
