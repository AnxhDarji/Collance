const testApi = async () => {
    try {
        const clientRes = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Client Testing 4', email: 'client4@test.com', password: 'password', role: 'client' })
        });
        const clientData = await clientRes.json();
        const cToken = clientData.token;
        
        const projRes = await fetch('http://localhost:5000/api/projects/create', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cToken}` },
          body: JSON.stringify({ title: 'Test Proj', description: 'Desc', budget: 100 })
        });
        const d = await projRes.json();
        console.log("PROJECT CREATED:", d);
    } catch(e) {
      console.error(e);
    }
  };
testApi();
