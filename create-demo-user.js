const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function createDemoUser() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/web-rophim'
  
  try {
    console.log('👤 Tạo demo user để test...')
    
    const client = new MongoClient(uri)
    await client.connect()
    
    const db = client.db()
    
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await db.collection('users').findOne({ email: 'demo@test.com' })
    
    if (existingUser) {
      console.log('✅ User demo@test.com đã tồn tại')
      console.log(`   Watchlist: ${existingUser.watchlist.length} phim`)
      await client.close()
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    // Tạo user mới
    const newUser = {
      name: 'Demo User',
      email: 'demo@test.com',
      password: hashedPassword,
      provider: 'credentials',
      watchlist: [
        'venom-thu-ac-cuoi-cung',
        'nguoi-nhen-khong-lo-nha', 
        'avengers-endgame'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(newUser)
    console.log('✅ Đã tạo demo user thành công!')
    console.log('   Email: demo@test.com')
    console.log('   Password: 123456')
    console.log(`   Watchlist: ${newUser.watchlist.length} phim`)
    
    await client.close()
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  }
}

createDemoUser()