'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { Movie } from '@/types/movie'

interface SearchSuggestionsProps {
  query: string
  onSelect: (movie: Movie) => void
  onClose: () => void
  isVisible: boolean
}

interface SearchResponse {
  success: boolean
  data: Movie[]
  total: number
}

export default function SearchSuggestions({ query, onSelect, onClose, isVisible }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches] = useState<string[]>([
    'Avengers', 'Spider-Man', 'Iron Man', 'Captain America'
  ])
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=1`)
        const data: SearchResponse = await response.json()
        
        if (data.success) {
          setSuggestions(data.data.slice(0, 6)) // Chỉ lấy 6 kết quả đầu
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-gray-800 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
    >
      {loading && (
        <div className="p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-400 text-sm">Đang tìm kiếm...</span>
        </div>
      )}

      {!loading && query.trim() && suggestions.length > 0 && (
        <div className="p-2">
          <h3 className="text-gray-400 text-xs font-medium px-3 py-2 border-b border-gray-800 mb-2">
            Kết quả tìm kiếm
          </h3>
          {suggestions.map((movie) => (
            <Link
              key={movie.id}
              href={`/phim/${movie.slug}`}
              className="flex items-center gap-3 p-3 text-white hover:bg-red-600/20 rounded-lg transition-colors"
              onClick={() => {
                onSelect(movie)
                onClose()
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-12 h-16 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{movie.title}</h4>
                <p className="text-gray-400 text-xs">
                  {movie.year} • {movie.country}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-500 text-xs">⭐ {movie.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-500 text-xs">{movie.type}</span>
                </div>
              </div>
            </Link>
          ))}
          
          {suggestions.length >= 6 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="block p-3 text-center text-red-400 hover:bg-red-600/20 rounded-lg transition-colors text-sm font-medium"
              onClick={onClose}
            >
              Xem tất cả kết quả →
            </Link>
          )}
        </div>
      )}

      {!loading && query.trim() && suggestions.length === 0 && (
        <div className="p-4 text-center text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Không tìm thấy kết quả cho "{query}"</p>
        </div>
      )}

      {!query.trim() && (
        <div className="p-2">
          <h3 className="text-gray-400 text-xs font-medium px-3 py-2 border-b border-gray-800 mb-2">
            Tìm kiếm gần đây
          </h3>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              className="flex items-center gap-3 w-full p-3 text-white hover:bg-red-600/20 rounded-lg transition-colors text-left"
              onClick={() => {
                // Handle recent search click
                onClose()
              }}
            >
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm">{search}</span>
            </button>
          ))}
          
          <div className="border-t border-gray-800 mt-2 pt-2">
            <h3 className="text-gray-400 text-xs font-medium px-3 py-2 mb-2">
              Trending
            </h3>
            {['Avengers: Endgame', 'Spider-Man', 'Demon Slayer'].map((trending, index) => (
              <button
                key={index}
                className="flex items-center gap-3 w-full p-3 text-white hover:bg-red-600/20 rounded-lg transition-colors text-left"
                onClick={() => {
                  // Handle trending search click
                  onClose()
                }}
              >
                <TrendingUp className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-sm">{trending}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}