async function test() {
  const input = {
    familyMembers: [{ name: "Test", age: 30, gender: "male", relationship: "Self", medicalConditions: [], medications: [], allergies: [], specialEquipment: [], bloodGroup: "Unknown" }],
    location: { state: "Maharashtra", district: "Mumbai", city: "Mumbai", pincode: "400001", housingType: "apartment", floorLevel: "above", nearbyWaterBodies: [] },
    preferences: { language: "en", hasPets: false, petType: "", petCount: 0, floodExperience: "none", budget: 0, specificConcerns: "" }
  };
  
  try {
    const res = await fetch('http://localhost:3000/api/generate-playbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
