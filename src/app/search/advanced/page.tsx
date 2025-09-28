'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Calendar, Globe, Star, Play } from 'lucide-react'

const GENRES = [
  'Hành Động', 'Tình Cảm', 'Hài Hước', 'Kinh Dị', 'Khoa Học Viễn Tưởng', 
  'Hoạt Hình', 'Phiêu Lưu', 'Chính Kịch', 'Tâm Lý', 'Gia Đình',
  'Thể Thao', 'Âm Nhạc', 'Lịch Sử', 'Chiến Tranh', 'Tài Liệu'
]

const COUNTRIES = [
  'Việt Nam', 'Hàn Quốc', 'Trung Quốc', 'Nhật Bản', 'Thái Lan', 
  'Âu Mỹ', 'Ấn Độ', 'Philippines', 'Indonesia', 'Malaysia'
]

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

const POPULAR_SEARCHES = [
  'Avengers', 'Spider-Man', 'Iron Man', 'Black Widow', 'Captain America',
  'One Piece', 'Naruto', 'Dragon Ball', 'Attack on Titan', 'Demon Slayer',
  'Squid Game', 'Kingdom', 'Crash Landing on You', 'Vincenzo', 'Hotel Del Luna',
  'Fast & Furious', 'John Wick', 'Mission Impossible', 'James Bond', 'Transformers'
]

export default function AdvancedSearchPage() {
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [movieType, setMovieType] = useState<'all' | 'single' | 'series'>('all')

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country)
        : [...prev, country]
    )
  }

  const handleYearToggle = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    const params = new URLSearchParams()
    params.set('q', searchQuery.trim())
    
    if (selectedGenres.length > 0) {
      params.set('genres', selectedGenres.join(','))
    }
    if (selectedCountries.length > 0) {
      params.set('countries', selectedCountries.join(','))
    }
    if (selectedYears.length > 0) {
      params.set('years', selectedYears.join(','))
    }
    if (minRating > 0) {
      params.set('rating', minRating.toString())
    }
    if (movieType !== 'all') {
      params.set('type', movieType)
    }
    
    router.push(`/search?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setSelectedGenres([])
    setSelectedCountries([])
    setSelectedYears([])
    setMinRating(0)
    setMovieType('all')
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Tìm kiếm nâng cao
            </h1>
            <p className="text-gray-400 text-lg">
              Tìm kiếm phim với nhiều bộ lọc chi tiết
            </p>
          </div>

          {/* Main Search */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên phim, diễn viên, đạo diễn..."
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-4 pr-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="absolute right-4 top-4 h-6 w-6 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-colors"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Movie Type */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setMovieType('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  movieType === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setMovieType('single')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  movieType === 'single'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Phim lẻ
              </button>
              <button
                onClick={() => setMovieType('series')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  movieType === 'series'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Phim bộ
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Genres */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Thể loại
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Quốc gia
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {COUNTRIES.map(country => (
                  <button
                    key={country}
                    onClick={() => handleCountryToggle(country)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedCountries.includes(country)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Years */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Năm phát hành
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                {YEARS.map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearToggle(year.toString())}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedYears.includes(year.toString())
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Đánh giá tối thiểu
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    {minRating.toFixed(1)} ⭐ trở lên
                  </span>
                  <span className="text-gray-500">
                    ({minRating === 0 ? 'Tất cả' : `${minRating}/10`})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedGenres.length > 0 || selectedCountries.length > 0 || selectedYears.length > 0 || minRating > 0 || movieType !== 'all') && (
            <div className="text-center mb-8">
              <button
                onClick={clearAllFilters}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Popular Searches */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <Play className="h-5 w-5" />
              Tìm kiếm phổ biến
            </h3>
            <div className="flex flex-wrap gap-3">
              {POPULAR_SEARCHES.map(search => (
                <button
                  key={search}
                  onClick={() => {
                    setSearchQuery(search)
                    router.push(`/search?q=${encodeURIComponent(search)}`)
                  }}
                  className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}