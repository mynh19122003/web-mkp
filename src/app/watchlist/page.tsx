'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { PhimAPIService } from '@/services/kkphim'
import { Movie } from '@/types/movie'
import MovieCard from '@/components/MovieCard'
import Link from 'next/link'
import { ArrowLeft, Trash2, Play, RefreshCw, LogIn } from 'lucide-react'
import WatchlistStats from '@/components/WatchlistStats'
import DetailedMovieCard from '@/components/DetailedMovieCard'

// API functions để gọi tới API watchlist chính thức với authentication
const watchlistAPI = {
  async getWatchlistWithDetails() {
    try {
      const response = await fetch('/api/watchlist?withDetails=true')
      if (response.ok) {
        const data = await response.json()
        return {
          movies: data.data || [],
          movieIds: data.movieIds || [],
          stats: data.stats || null,
          total: data.total || 0,
          validMovies: data.validMovies || 0,
          userEmail: data.userEmail
        }
      }
      return { movies: [], movieIds: [], stats: null, total: 0, validMovies: 0, userEmail: null }
    } catch (error) {
      console.error('Error fetching watchlist with details:', error)
      return { movies: [], movieIds: [], stats: null, total: 0, validMovies: 0, userEmail: null }
    }
  },
  
  async removeFromWatchlist(movieId: string) {
    try {
      const response = await fetch(`/api/watchlist?movieId=${movieId}`, {
        method: 'DELETE'
      })
      return response.ok
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      return false
    }
  },

  async getWatchlistStats() {
    try {
      // Stats được tính trong getWatchlistWithDetails API
      return null
    } catch (error) {
      console.error('Error fetching watchlist stats:', error)
      return null
    }
  }
}

export default function WatchlistPage() {
  const { data: session, status } = useSession()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [detailedStats, setDetailedStats] = useState<any>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWatchlist()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      
      // Lấy watchlist với thông tin chi tiết từ API chính thức
      const { movies: detailedMovies, movieIds, stats, total, validMovies, userEmail } = await watchlistAPI.getWatchlistWithDetails()
      
      setMovies(detailedMovies)
      setWatchlist(movieIds)
      setDetailedStats(stats)
      
      console.log(`📊 Loaded ${validMovies}/${total} movies with details for user: ${userEmail}`)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }



  const handleRemove = async (movieId: string, movieTitle: string) => {
    if (confirm(`Bạn có chắc muốn xóa "${movieTitle}" khỏi danh sách không?`)) {
      const success = await watchlistAPI.removeFromWatchlist(movieId)
      if (success) {
        console.log(`Đã xóa "${movieTitle}" khỏi danh sách`)
        await fetchWatchlist() // Refresh danh sách sau khi xóa
      }
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchWatchlist()
    setRefreshing(false)
  }

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <LogIn className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Cần đăng nhập</h1>
          <p className="text-gray-400 mb-8">
            Bạn cần đăng nhập để xem danh sách phim đã lưu của mình.
          </p>
          <Link 
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mb-4"></div>
          <p className="text-white">Đang tải danh sách phim...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold mb-2">Danh Sách Của Tôi</h1>
              <p className="text-gray-400">
                {movies.length} phim đã lưu
              </p>
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {/* Empty State */}
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 text-8xl mb-8">📺</div>
            <h2 className="text-2xl font-bold mb-4">Danh sách trống</h2>
            <p className="text-gray-400 text-lg mb-8">
              Bạn chưa thêm phim nào vào danh sách. <br />
              Hãy khám phá và thêm những bộ phim yêu thích!
            </p>
            <Link 
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Khám Phá Phim
            </Link>
          </div>
        ) : (
          <>
            <WatchlistStats totalMovies={movies.length} refreshTrigger={refreshing ? 1 : 0} />
            
            {/* Movies Grid - Using detailed cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <DetailedMovieCard
                key={movie.id}
                movie={movie}
                onRemove={handleRemove}
              />
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  )
}