'use client'

import { Movie } from '@/types/movie'
import { Star, Clock, Calendar, Eye, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface DetailedMovieCardProps {
  movie: Movie & {
    addedToWatchlistAt?: string
    watchlistId?: string
    isInWatchlist?: boolean
  }
  onRemove?: (movieId: string, movieTitle: string) => void
}

export default function DetailedMovieCard({ movie, onRemove }: DetailedMovieCardProps) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onRemove) {
      onRemove(movie.id, movie.title)
    }
  }

  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 group">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={movie.poster || movie.thumbnail || '/placeholder-movie.jpg'}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link 
            href={`/phim/${movie.slug || movie.id}`}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
          >
            <PlayCircle className="w-8 h-8 text-white" />
          </Link>
        </div>

        {/* Remove button */}
        {onRemove && (
          <button
            onClick={handleRemoveClick}
            className="absolute top-2 right-2 bg-red-600/80 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700"
            title={`Xóa "${movie.title}" khỏi danh sách`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Quality badge */}
        {movie.quality && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {movie.quality}
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>
        
        {movie.originalTitle && movie.originalTitle !== movie.title && (
          <p className="text-gray-400 text-sm mb-2 line-clamp-1">
            {movie.originalTitle}
          </p>
        )}

        {/* Movie stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          {movie.year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.year}</span>
            </div>
          )}
          
          {movie.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{movie.duration} phút</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-white font-medium">
              {movie.imdbRating || movie.rating || 'N/A'}
            </span>
          </div>
          
          {movie.views && (
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>{movie.views.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Categories */}
        {movie.categories && movie.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.categories.slice(0, 3).map((category) => (
              <span
                key={category.id}
                className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
              >
                {category.name}
              </span>
            ))}
            {movie.categories.length > 3 && (
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                +{movie.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {movie.description && (
          <p className="text-gray-400 text-sm line-clamp-3 mb-3">
            {movie.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        {/* Action button */}
        <Link 
          href={`/phim/${movie.slug || movie.id}`}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-center block"
        >
          Xem phim
        </Link>
      </div>
    </div>
  )
}