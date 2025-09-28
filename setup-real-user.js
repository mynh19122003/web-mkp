const { MongoClient } = require('mongodb');

const REAL_USER_EMAIL = 'user@rophim.com'; // User thật thay vì test user
const REAL_MOVIE_IDS = [
  '37c9bc66ebd3a2e455ee2a74feae4c0e', // ID của "Hãy Để Tôi Tỏa Sáng"
  '64dbde30fb80ade324d5fc24b0042f34', // ID của "Vây Bắt"
  '0722ba570f1e381a4cf86360ad7d2000', // ID của "Tuyết Canh Ba"
  '021de1d3005e39b3eab3f7591231696b', // ID của "Quái Vật"
  '56e3fb541605e047f551bffc5a3dc209'  // ID của "Hiên Viên Kiếm"
];

async function setupRealUser() {
  let client;
  
  try {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    
    const db = client.db('watchlistdb');
    
    // Xóa test user cũ
    await db.collection('users').deleteMany({ email: { $regex: /test@/ } });
    
    // Tạo user thật với movie IDs từ PhimAPI
    const result = await db.collection('users').updateOne(
      { email: REAL_USER_EMAIL },
      { 
        $set: { 
          watchlist: REAL_MOVIE_IDS,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Tạo user thật thành công:');
    console.log(`- Email: ${REAL_USER_EMAIL}`);
    console.log(`- Số phim: ${REAL_MOVIE_IDS.length}`);
    console.log('- Movie IDs:');
    REAL_MOVIE_IDS.forEach((id, index) => {
      console.log(`  ${index + 1}. ${id}`);
    });
    
    // Kiểm tra lại data
    const user = await db.collection('users').findOne({ email: REAL_USER_EMAIL });
    console.log('\n📊 Dữ liệu user:');
    console.log(`- Watchlist có: ${user.watchlist.length} phim`);
    console.log(`- Tạo lúc: ${user.createdAt}`);
    
    console.log('\n💡 User này sẽ cần authentication để truy cập watchlist');
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo user:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

setupRealUser();