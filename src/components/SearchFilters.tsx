'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { Movie } from '@/types/movie'

interface SearchFiltersProps {
  movies: Movie[]
  onFilterChange: (filteredMovies: Movie[]) => void
}

const GENRES = [
  'Hành Động', 'Tình Cảm', 'Hài Hước', 'Kinh Dổ', 'Khoa Học Viễn Tưởng', 
  'Hoạt Hình', 'Phiêu Lưu', 'Chính Kịch', 'Tâm Lý', 'Gia Đình'
]

const COUNTRIES = [
  'Việt Nam', 'Hàn Quốc', 'Trung Quốc', 'Nhật Bản', 'Thái Lan', 'Âu Mỹ'
]

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

const QUALITIES = ['HD', 'FHD', '4K', 'CAM', 'TS']

export default function SearchFilters({ movies, onFilterChange }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedQuality, setSelectedQuality] = useState<string>('')
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10])

  useEffect(() => {
    // Apply filters
    let filteredMovies = [...movies]

    if (selectedGenre) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.genres.includes(selectedGenre)
      )
    }

    if (selectedCountry) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.country?.includes(selectedCountry)
      )
    }

    if (selectedYear) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.year === parseInt(selectedYear)
      )
    }

    if (selectedQuality) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.quality === selectedQuality
      )
    }

    filteredMovies = filteredMovies.filter(movie => {
      const rating = movie.rating || 0
      return rating >= ratingRange[0] && rating <= ratingRange[1]
    })

    onFilterChange(filteredMovies)
  }, [movies, selectedGenre, selectedCountry, selectedYear, selectedQuality, ratingRange, onFilterChange])

  const clearAllFilters = () => {
    setSelectedGenre('')
    setSelectedCountry('')
    setSelectedYear('')
    setSelectedQuality('')
    setRatingRange([0, 10])
  }

  const hasActiveFilters = selectedGenre || selectedCountry || selectedYear || selectedQuality || ratingRange[0] > 0 || ratingRange[1] < 10

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters 
            ? 'bg-red-600 border-red-600 text-white' 
            : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
        }`}
      >
        <Filter className="h-4 w-4" />
        <span>Bộ lọc</span>
        {hasActiveFilters && (
          <span className="bg-white text-red-600 rounded-full px-2 py-0.5 text-xs font-medium">
            {[selectedGenre, selectedCountry, selectedYear, selectedQuality].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Filter Content */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 backdrop-blur-md border border-gray-800 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Bộ lọc tìm kiếm</h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                {/* Genre Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Thể loại
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả thể loại</option>
                    {GENRES.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Quốc gia
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả quốc gia</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Năm phát hành
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả năm</option>
                    {YEARS.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Quality Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Chất lượng
                  </label>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả chất lượng</option>
                    {QUALITIES.map(quality => (
                      <option key={quality} value={quality}>{quality}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Range */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Đánh giá: {ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)} ⭐
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={ratingRange[0]}
                      onChange={(e) => setRatingRange([parseFloat(e.target.value), ratingRange[1]])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={ratingRange[1]}
                      onChange={(e) => setRatingRange([ratingRange[0], parseFloat(e.target.value)])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedGenre && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
              {selectedGenre}
              <button onClick={() => setSelectedGenre('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedCountry && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
              {selectedCountry}
              <button onClick={() => setSelectedCountry('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedYear && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
              {selectedYear}
              <button onClick={() => setSelectedYear('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedQuality && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
              {selectedQuality}
              <button onClick={() => setSelectedQuality('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}