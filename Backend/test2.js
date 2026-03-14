const testApi = async () => {
    try {
      const projRes = await fetch('http://localhost:5000/api/projects/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer undefined` },
        body: JSON.stringify({ title: 'Test Proj', description: 'Desc', budget: 100 })
      });
      console.log(await projRes.text());
    } catch(e) {
      console.error(e);
    }
  };
  testApi();
  
