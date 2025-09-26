import HeroSection from '@/components/HeroSection'
import MovieRowWithAPI from '@/components/MovieRowWithAPI'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      
      <div className="relative">  
        {/* Phim Sôi Nổi Nhất - Top trending */}
        <MovieRowWithAPI title="🔥 SÔI NỔI NHẤT" type="new" size="large" />
        
        {/* Phim Yêu Thích Nhất - Popular movies */}
        <MovieRowWithAPI title="❤️ YÊU THÍCH NHẤT" type="movie" />
        
        {/* Phim Mới Cập Nhật */}
        <MovieRowWithAPI title="🆕 PHIM MỚI CẬP NHẬT" type="new" />
        
        {/* Phim Chiếu Rạp */}
        <MovieRowWithAPI title="� PHIM CHIẾU RẠP" type="cinema" />
        
        {/* Phim Bộ */}
        <MovieRowWithAPI title="📺 PHIM BỘ" type="tv" />
        
        {/* Phim Lẻ */}
        <MovieRowWithAPI title="� PHIM LẺ" type="movie" />
        
        {/* Phim Hoạt Hình */}
        <MovieRowWithAPI title="🎨 PHIM HOẠT HÌNH" type="anime" />
        
        {/* Phim Theo Quốc Gia */}
        <MovieRowWithAPI title="🇰🇷 PHIM HÀN QUỐC" type="korean" />
        <MovieRowWithAPI title="🇨🇳 PHIM TRUNG QUỐC" type="chinese" />
        <MovieRowWithAPI title="🇺🇸 PHIM ÂU MỸ" type="western" />
      </div>
    </div>
  )
}
