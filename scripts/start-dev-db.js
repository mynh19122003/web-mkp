const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

let mongod;

async function startMemoryDB() {
  try {
    console.log('🚀 Starting MongoDB Memory Server for Development...');
    mongod = await MongoMemoryServer.create({ 
      instance: { 
        port: 27017 
      } 
    });
    
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    console.log('✅ Connected to MongoDB Memory Server');
    
    const db = client.db('watchlistdb');
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    console.log('🧹 Cleared existing data');
    
    // Create test user with sample watchlist
    const hashedPassword = await bcrypt.hash('123456', 12);
    const testUser = {
      email: 'test@watchlist.com',
      password: hashedPassword,
      name: 'Test User',
      watchlist: [
        'venom-thu-ac-cuoi-cung',
        'nguoi-nhen-khong-lo-nha',
        'avengers-endgame'
      ],
      createdAt: new Date()
    };
    
    await db.collection('users').insertOne(testUser);
    console.log('👤 Created test user with sample watchlist');
    console.log('   📧 Email: test@watchlist.com');
    console.log('   🔑 Password: 123456');
    console.log(`   🎬 Watchlist: ${testUser.watchlist.length} movies`);
    
    await client.close();
    
    console.log('🎯 MongoDB Memory Server is ready on port 27017');
    console.log('💡 Use this for development and testing');
    console.log('⏹️  Press Ctrl+C to stop the server');
    
    // Keep server running
    process.on('SIGINT', async () => {
      console.log('\\n🛑 Shutting down MongoDB Memory Server...');
      if (mongod) {
        await mongod.stop();
      }
      process.exit(0);
    });
    
  } catch(error) {
    console.error('❌ Error starting MongoDB Memory Server:', error.message);
    process.exit(1);
  }
}

startMemoryDB();
