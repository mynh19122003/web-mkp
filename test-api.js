// Test script để kiểm tra API endpoints
async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  // Test 1: Registration API
  console.log('1️⃣ Testing Registration API...');
  try {
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456',
        name: 'Test User'
      })
    });

    const registerResult = await registerResponse.json();
    console.log('✅ Registration Response:', registerResult);
  } catch (error) {
    console.log('❌ Registration Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Movies API
  console.log('2️⃣ Testing Movies API...');
  try {
    const moviesResponse = await fetch('http://localhost:3000/api/movies');
    const moviesResult = await moviesResponse.json();
    console.log('✅ Movies Response Status:', moviesResponse.status);
    console.log('Full Response:', JSON.stringify(moviesResult, null, 2));
  } catch (error) {
    console.log('❌ Movies Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Hero Movies API  
  console.log('3️⃣ Testing Hero Movies API...');
  try {
    const heroResponse = await fetch('http://localhost:3000/api/hero-movies');
    const heroResult = await heroResponse.json();
    console.log('✅ Hero Movies Response Status:', heroResponse.status);
    console.log('Hero Response:', JSON.stringify(heroResult, null, 2));
  } catch (error) {
    console.log('❌ Hero Movies Error:', error.message);
  }

  console.log('\n🎬 API Testing Complete!');
}

// Run tests
testAPI().catch(console.error);