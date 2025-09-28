import HeroSection from '@/components/HeroSection'
import MovieRowWithAPI from '@/components/MovieRowWithAPI'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      
      <div className="relative">  
        {/* Phim Sôi Nổi Nhất - Top trending */}
        <MovieRowWithAPI title="🔥 SÔI NỔI NHẤT"  rating="good" />
        
        {/* Phim Mới Cập Nhật */}
        <MovieRowWithAPI title="🆕 PHIM MỚI CẬP NHẬT" type="new" />
        
        {/* Phim Chiếu Rạp */}
        <MovieRowWithAPI title="� PHIM CHIẾU RẠP" type="cinema" />
        
        {/* Phim Bộ */}
        <MovieRowWithAPI title="📺 PHIM BỘ" type="series" />
        
        {/* Phim Lẻ */}
        <MovieRowWithAPI title="� PHIM LẺ" type="single" />
        
        {/* Phim Hoạt Hình */}
        <MovieRowWithAPI title="🎨 PHIM HOẠT HÌNH" type="anime" />
        
        {/* Phim Theo Quốc Gia */}
        <MovieRowWithAPI title="🇰🇷 PHIM HÀN QUỐC" type="korean" />
        <MovieRowWithAPI title="🇨🇳 PHIM TRUNG QUỐC" type="chinese" />
        <MovieRowWithAPI title="🇺🇸 PHIM ÂU MỸ" type="western" />
        
        {/* 
        ═══════════════════════════════════════════════════════════════════════════════
        💡 GỢI Ý THÊM PHẦN MỚI:
        ═══════════════════════════════════════════════════════════════════════════════
        
        🎬 PHIM THEO THỂ LOẠI (sử dụng categorySlug):
        <MovieRowWithAPI title="⚔️ PHIM HÀNH ĐỘNG" type="category" categorySlug="hanh-dong" />
        <MovieRowWithAPI title="💕 PHIM TÌNH CẢM" type="category" categorySlug="tinh-cam" />
        <MovieRowWithAPI title="😂 PHIM HÀI" type="category" categorySlug="hai-huoc" />
        <MovieRowWithAPI title="👻 PHIM KINH DỊ" type="category" categorySlug="kinh-di" />
        
        🏆 PHIM THEO CHẤT LƯỢNG:
        <MovieRowWithAPI title="🏆 PHIM ĐỈNH CAO" type="new" rating="excellent" voteCount="popular" />
        <MovieRowWithAPI title="⭐ PHIM CHẤT LƯỢNG" type="single" rating="high" voteCount="trending" />
        <MovieRowWithAPI title="🔥 PHIM ĐANG HOT" type="new" voteCount="viral" />
        <MovieRowWithAPI title="💎 PHIM THÍCH HỢP" type="series" rating="good" voteCount="niche" />
        
        📈 PHIM THEO TRẠNG THÁI:
        <MovieRowWithAPI title="🆕 PHIM MỚI NHẤT" type="new" voteCount="fresh" />
        <MovieRowWithAPI title="📊 PHIM TRENDING" type="new" voteCount="trending" />
        <MovieRowWithAPI title="🌟 PHIM NỔI TIẾNG" type="single" voteCount="popular" />
        ═══════════════════════════════════════════════════════════════════════════════
        */}
      </div>
    </div>
  )
}
