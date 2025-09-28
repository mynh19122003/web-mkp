const { MongoClient } = require('mongodb')

async function updateWatchlistWithValidMovies() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/web-rophim'
  
  // Sample valid movie slugs from the current API
  const validMovieIds = [
    'venom-thu-ac-cuoi-cung',
    'nguoi-nhen-khong-lo-nha', 
    'avengers-endgame',
    'anh-em-doi-dau-bara-naga',
    'am-anh-kinh-hoang-nghi-le-cuoi-cung',
    'zombie-cung-cua-ba',
    'anh-hung-xa-dieu-truyen-hiep-chi-dai-gia',
    'bo-tu-sieu-dang-buoc-di-dau-tien'
  ]
  
  try {
    console.log('🔄 Đang cập nhật watchlist với movie IDs hợp lệ...')
    
    const client = new MongoClient(uri)
    await client.connect()
    
    const db = client.db()
    const users = await db.collection('users').find({ watchlist: { $exists: true, $ne: [] } }).toArray()
    
    console.log(`👥 Tìm thấy ${users.length} user có watchlist`)
    
    for (const user of users) {
      // Lấy 3 phim ngẫu nhiên từ danh sách hợp lệ
      const randomMovies = validMovieIds
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { watchlist: randomMovies } }
      )
      
      console.log(`✅ Cập nhật watchlist cho ${user.email}: ${randomMovies.join(', ')}`)
    }
    
    await client.close()
    console.log('🎉 Hoàn thành cập nhật watchlist!')
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  }
}

updateWatchlistWithValidMovies()