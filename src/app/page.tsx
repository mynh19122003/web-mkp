import HeroSection from '@/components/HeroSection'
import MovieRowWithAPI from '@/components/MovieRowWithAPI'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      
      <div className="relative">  
        {/* Phim Sôi Nổi Nhất - Top trending */}
        <MovieRowWithAPI title="🔥 SÔI NỔI NHẤT"  rating="good" />
        
        {/* Phim Yêu Thích Nhất - Popular singles */}
        <MovieRowWithAPI title="❤️ YÊU THÍCH NHẤT" voteCount='niche' />
        {/* Phim Mới Cập Nhật */}
        <MovieRowWithAPI title="🆕 PHIM MỚI CẬP NHẬT" type="new" />
        
        {/* Phim Chiếu Rạp */}
        <MovieRowWithAPI title="� PHIM CHIẾU RẠP" type="cinema" />
        
        {/* Phim Bộ */}
        <MovieRowWithAPI title="📺 PHIM BỘ" type="series" />
        
        {/* Phim Lẻ */}
        <MovieRowWithAPI title="� PHIM LẺ" type="single" />
        
        {/* Phim Hoạt Hình */}
        <MovieRowWithAPI title="🎨 ANIME" type="anime" />
        
        {/* Phim Theo Quốc Gia */}
        <MovieRowWithAPI title="🇰🇷 PHIM HÀN QUỐC" type="korean" />
        <MovieRowWithAPI title="🇨🇳 PHIM TRUNG QUỐC" type="chinese" />
        <MovieRowWithAPI title="🇺🇸 PHIM ÂU MỸ" type="western" />
        
        {/* 
        💡 GỢI Ý THÊM:
        
        🎬 THEO THỂ LOẠI:
        <MovieRowWithAPI title="⚔️ PHIM HÀNH ĐỘNG" categorySlug="hanh-dong" />
        <MovieRowWithAPI title="💕 PHIM TÌNH CẢM" categorySlug="tinh-cam" />
        <MovieRowWithAPI title="👻 PHIM KINH DỊ" categorySlug="kinh-di" />
        
        🏆 THEO CHẤT LƯỢNG:
        <MovieRowWithAPI title="🏆 PHIM ĐỈNH CAO" rating="excellent" voteCount="popular" />
        <MovieRowWithAPI title="🔥 PHIM HOT" voteCount="viral" />
        
        📈 KHÁC:
        <MovieRowWithAPI title="🆕 MỚI NHẤT" voteCount="fresh" />
        <MovieRowWithAPI title="📊 TRENDING" voteCount="trending" />
        */}
      </div>
    </div>
  )
}
