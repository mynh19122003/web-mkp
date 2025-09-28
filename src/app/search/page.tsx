'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/MovieCard'
import SearchFilters from '@/components/SearchFilters'
import { Movie } from '@/types/movie'
import { Search, Filter, Grid3X3, List, ChevronDown } from 'lucide-react'

interface SearchResult {
  success: boolean
  data: Movie[]
  query: string
  page: number
  total: number
  error?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'relevance' | 'year' | 'rating'>('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  
  // Initialize filteredMovies when searchResults change
  useEffect(() => {
    if (searchResults) {
      setFilteredMovies(searchResults.data)
    }
  }, [searchResults])

  const fetchSearchResults = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&page=${page}`)
      const data: SearchResult = await response.json()

      if (data.success) {
        setSearchResults(data)
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tìm kiếm')
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      fetchSearchResults(query, currentPage)
    }
  }, [query, currentPage])

  const sortedMovies = filteredMovies ? [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'year':
        return (b.year || 0) - (a.year || 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0 // Keep original order for relevance
    }
  }) : []

  if (!query) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Tìm kiếm phim</h1>
            <p className="text-gray-400">Nhập từ khóa để tìm kiếm phim yêu thích của bạn</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Kết quả tìm kiếm
              </h1>
              <p className="text-gray-400">
                {loading ? (
                  'Đang tìm kiếm...'
                ) : searchResults ? (
                  `Tìm thấy ${filteredMovies.length} kết quả cho "${query}" ${filteredMovies.length !== searchResults.total ? `(lọc từ ${searchResults.total})` : ''}`
                ) : (
                  `Tìm kiếm: "${query}"`
                )}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filters */}
              {searchResults && (
                <SearchFilters 
                  movies={searchResults.data} 
                  onFilterChange={setFilteredMovies}
                />
              )}

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-900 border border-gray-700 text-white pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                >
                  <option value="relevance">Liên quan nhất</option>
                  <option value="year">Năm phát hành</option>
                  <option value="rating">Đánh giá</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex bg-gray-900 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-400">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={() => fetchSearchResults(query, currentPage)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && searchResults && (
          <>
            {sortedMovies.length > 0 ? (
              <div className={`pb-20 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6' 
                  : 'space-y-4'
              }`}>
                {sortedMovies.map((movie) => (
                  <div key={movie.id}>
                    {viewMode === 'grid' ? (
                      <MovieCard movie={movie} />
                    ) : (
                      <div className="flex gap-4 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors">
                        <div className="flex-shrink-0">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-20 h-28 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-lg mb-1 truncate">
                            {movie.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                            {movie.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{movie.year}</span>
                            <span>⭐ {movie.rating?.toFixed(1) || 'N/A'}</span>
                            <span>{movie.country}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  Không tìm thấy kết quả
                </h2>
                <p className="text-gray-400 mb-6">
                  Không có phim nào khớp với từ khóa "{query}"
                </p>
                <div className="text-gray-500 text-sm space-y-1">
                  <p>💡 Gợi ý:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Kiểm tra chính tả từ khóa</li>
                    <li>Thử sử dụng từ khóa khác</li>
                    <li>Sử dụng từ khóa ngắn gọn hơn</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Pagination */}
            {sortedMovies.length > 0 && searchResults.total > 20 && (
              <div className="flex justify-center pb-20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-gray-400">
                    Trang {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={sortedMovies.length < 20}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}