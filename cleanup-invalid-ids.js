const { MongoClient } = require('mongodb')

async function cleanupInvalidMovieIds() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/web-rophim'
  
  try {
    console.log('🧹 Đang làm sạch movie IDs không hợp lệ...')
    
    const client = new MongoClient(uri)
    await client.connect()
    
    const db = client.db()
    
    // Tìm user có invalid movie ID
    const users = await db.collection('users').find({
      watchlist: { $in: ['aa48055d254b34d08c1a88a7c92c58cd'] }
    }).toArray()
    
    console.log(`👥 Tìm thấy ${users.length} user có movie ID không hợp lệ`)
    
    for (const user of users) {
      // Loại bỏ ID không hợp lệ và thay thế bằng ID hợp lệ
      const cleanWatchlist = user.watchlist.filter(id => id !== 'aa48055d254b34d08c1a88a7c92c58cd')
      
      // Thêm một movie slug hợp lệ thay thế
      if (cleanWatchlist.length < 3) {
        cleanWatchlist.push('venom-thu-ac-cuoi-cung')
      }
      
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { watchlist: cleanWatchlist } }
      )
      
      console.log(`✅ Cập nhật watchlist cho ${user.email}: ${cleanWatchlist.join(', ')}`)
    }
    
    await client.close()
    console.log('🎉 Hoàn thành làm sạch!')
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  }
}

cleanupInvalidMovieIds()