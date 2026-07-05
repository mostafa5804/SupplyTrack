const axios = require('axios');
async function run() {
  try {
    const res = await axios.post('http://localhost:3000/api/login', { username: 'admin', password: 'admin' });
    const token = res.data.token;
    
    const reqRes = await axios.get('http://localhost:3000/api/requests', { headers: { Authorization: `Bearer ${token}` } });
    console.log("Requests:");
    reqRes.data.forEach(r => console.log(r.id, r.status));
  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}
run();
