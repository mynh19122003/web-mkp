import { PhimAPIService } from '@/services/kkphim'
import MovieCard from '@/components/MovieCard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function PhimListPage() {
  const movies = await PhimAPIService.getNewMovies(1)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Về Trang Chủ
          </Link>
          <div className="w-px h-6 bg-gray-600" />
          <h1 className="text-3xl font-bold">Danh Sách Phim</h1>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id || index}
              movie={movie}
              size="medium"
            />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-colors">
            Xem Thêm Phim
          </button>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Danh Sách Phim | RoPhim',
  description: 'Xem danh sách tất cả phim mới nhất, phim lẻ, phim bộ tại RoPhim',
}