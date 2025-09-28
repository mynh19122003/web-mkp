const { MongoClient } = require('mongodb')

async function checkUsers() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/web-rophim'
  
  try {
    const client = new MongoClient(uri)
    await client.connect()
    
    const db = client.db()
    const users = await db.collection('users').find().toArray()
    
    console.log(`👥 Có ${users.length} user trong database:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Watchlist: ${user.watchlist ? user.watchlist.length : 0} phim`)
      if (user.watchlist && user.watchlist.length > 0) {
        console.log(`   Movies: ${user.watchlist.join(', ')}`)
      }
      console.log('   ---')
    })
    
    await client.close()
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  }
}

checkUsers()