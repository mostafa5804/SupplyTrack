const axios = require('axios');
async function run() {
  try {
    const res = await axios.post('http://localhost:3000/api/login', { username: 'admin', password: 'admin' });
    const token = res.data.token;
    
    // Create request
    const createRes = await axios.post('http://localhost:3000/api/requests', {
      items: [{ itemName: 'Item 1', unit: 'pcs', reqQty: 10, supQty: 10, whQty: 10, buyQty: 0 }]
    }, { headers: { Authorization: `Bearer ${token}` } });
    const reqId = createRes.data.id;
    console.log("Created:", reqId);
    
    // Supervisor approve
    await axios.put(`http://localhost:3000/api/requests/${reqId}/supervisor`, {
      action: 'approve', items: createRes.data.items, comment: 'ok'
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Supervisor approved");

    // Warehouse check
    const whRes = await axios.put(`http://localhost:3000/api/requests/${reqId}/warehouse`, {
      items: createRes.data.items
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Warehouse checked. Status:", whRes.data.status);
    
    // Deliver
    const itemsToDeliver = whRes.data.items;
    itemsToDeliver[0].deliveredQty = 10;
    const deliverRes = await axios.put(`http://localhost:3000/api/requests/${reqId}/deliver`, {
      items: itemsToDeliver
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Deliver res status:", deliverRes.data.status);

  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}
run();
