const axios = require('axios');
async function run() {
  try {
    const res = await axios.post('http://localhost:3000/api/login', { username: 'admin', password: 'admin' });
    const token = res.data.token;
    console.log("Token:", token);
    
    const reqRes = await axios.get('http://localhost:3000/api/requests', { headers: { Authorization: `Bearer ${token}` } });
    const req = reqRes.data.find(r => r.status === 'pending_delivery' || r.status === 'partial_delivery');
    console.log("Found request:", req?.id);
    
    if (req) {
      const putRes = await axios.put(`http://localhost:3000/api/requests/${req.id}/deliver`, { items: req.items }, { headers: { Authorization: `Bearer ${token}` } });
      console.log("PUT res:", putRes.data);
    }
  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}
run();
