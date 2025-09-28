const { MongoClient } = require('mongodb')

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/web-rophim'
  
  try {
    console.log('🔌 Đang kết nối MongoDB...')
    const client = new MongoClient(uri)
    await client.connect()
    
    console.log('✅ Kết nối MongoDB thành công!')
    
    // Test database
    const db = client.db()
    const collections = await db.collections()
    console.log(`📁 Database: ${db.databaseName}`)
    console.log(`📚 Collections: ${collections.map(c => c.collectionName).join(', ') || 'Chưa có collection nào'}`)
    
    await client.close()
    console.log('🔌 Đã đóng kết nối MongoDB')
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message)
  }
}

testConnection()