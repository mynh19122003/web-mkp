const { MongoClient } = require('mongodb');

const TEST_USER_EMAIL = 'test@watchlist.com';

// Các phim thật từ PhimAPI
const REAL_MOVIES = [
  'hay-de-toi-toa-sang',
  'vay-bat', 
  'tuyet-canh-ba',
  'quai-vat-2025',
  'ultraman-omega'
];

async function updateWatchlistWithRealMovies() {
  let client;
  
  try {
    // Kết nối tới MongoDB Memory Server
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    
    const db = client.db('watchlistdb');
    
    // Cập nhật watchlist với phim thật
    const result = await db.collection('users').updateOne(
      { email: TEST_USER_EMAIL },
      { 
        $set: { 
          watchlist: REAL_MOVIES,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Cập nhật watchlist thành công:');
    console.log(`- User: ${TEST_USER_EMAIL}`);
    console.log(`- Số phim: ${REAL_MOVIES.length}`);
    console.log('- Danh sách phim:');
    REAL_MOVIES.forEach((movie, index) => {
      console.log(`  ${index + 1}. ${movie}`);
    });
    
    // Kiểm tra lại data
    const user = await db.collection('users').findOne({ email: TEST_USER_EMAIL });
    console.log('\n📊 Dữ liệu sau khi cập nhật:');
    console.log(`- Watchlist có: ${user.watchlist.length} phim`);
    
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật watchlist:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

updateWatchlistWithRealMovies();