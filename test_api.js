import fetch from 'node-fetch'; // wait, it's global fetch

async function run() {
  const res = await fetch('http://localhost:3000/api/feishu/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "test", 
      overallPhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...", 
      detailPhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...", 
      category: "电子产品", 
      foundLocation: {"zone": "A区", "table": "A1"}, 
      description: "test", 
      isHighValue: false, 
      finderName: "test"
    })
  });
  console.log(res.status);
  console.log(await res.text());
}

run();
