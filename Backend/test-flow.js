const testApi = async () => {
  try {
    const clientRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "C1", email: "c1@c.com", password: "p", role: "client" })
    });
    const clientData = await clientRes.json();
    const cToken = clientData.token;

    const freeRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "F1", email: "f1@f.com", password: "p", role: "freelancer" })
    });
    const freeData = await freeRes.json();
    const fToken = freeData.token;

    const projRes = await fetch('http://localhost:5000/api/projects/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cToken}` },
      body: JSON.stringify({ title: "Test Proj", description: "Desc", budget: 100 })
    });
    const projData = await projRes.json();
    const pCode = projData.project_code;
    console.log("Created Project:", pCode);

    await fetch('http://localhost:5000/api/proposals/request', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${fToken}` },
      body: JSON.stringify({ projectCode: pCode, message: "Hi", price: 50 })
    });
    console.log("Requested to join");

    const incRes = await fetch('http://localhost:5000/api/proposals/incoming', {
      headers: { 'Authorization': `Bearer ${cToken}` }
    });
    const incData = await incRes.json();
    const propId = incData[0].id;

    const accRes = await fetch('http://localhost:5000/api/contracts/accept', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cToken}` },
      body: JSON.stringify({ proposalId: propId })
    });
    console.log("Accepted:", await accRes.json());

    const cContracts = await fetch('http://localhost:5000/api/contracts/my-contracts', {
      headers: { 'Authorization': `Bearer ${cToken}` }
    });
    console.log("Client Contracts:", await cContracts.json());

    const fContracts = await fetch('http://localhost:5000/api/contracts/my-contracts', {
      headers: { 'Authorization': `Bearer ${fToken}` }
    });
    console.log("Freelancer Contracts:", await fContracts.json());

  } catch(e) {
    console.error(e);
  }
};
testApi();
