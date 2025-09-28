'use client'

import { Movie } from '@/types/movie'
import { Calendar, Clock, Star, Globe, Tag } from 'lucide-react'
import SimpleWatchlistButton from './SimpleWatchlistButton'

interface MovieInfoProps {
  movie: Movie
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-gray-400 text-sm mb-3">{movie.originalTitle}</p>
          )}
        </div>
        
        <SimpleWatchlistButton 
          movieId={movie.slug || movie.id}
          movieTitle={movie.title}
          variant="icon"
          size="medium"
        />
      </div>

      {/* Rating and Basic Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {(movie.rating > 0 || movie.voteAverage || movie.imdbRating) && (
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">
              {movie.voteAverage ? movie.voteAverage.toFixed(1) : 
               movie.imdbRating ? movie.imdbRating.toFixed(1) : 
               movie.rating.toFixed(1)}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-1 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{movie.year}</span>
        </div>
        
        {movie.duration > 0 && (
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1 text-gray-400">
          <Globe className="w-4 h-4" />
          <span>{movie.country}</span>
        </div>

        <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
          {movie.quality}
        </div>
      </div>

      {/* Episodes Info */}
      {(movie.totalEpisodes || movie.currentEpisode) && (
        <div className="flex items-center space-x-4 text-sm">
          {movie.totalEpisodes && (
            <div className="flex items-center space-x-1 text-blue-400">
              <Tag className="w-4 h-4" />
              <span>{movie.totalEpisodes} tập</span>
            </div>
          )}
          {movie.currentEpisode && (
            <div className="text-green-400">
              Tập {movie.currentEpisode}
            </div>
          )}
          {movie.isCompleted && (
            <div className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
              Hoàn thành
            </div>
          )}
        </div>
      )}

      {/* Genres */}
      {movie.genres.length > 0 && (
        <div>
          <h4 className="text-white font-semibold mb-2">Thể loại</h4>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {movie.description && (
        <div>
          <h4 className="text-white font-semibold mb-2">Mô tả</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {movie.description}
          </p>
        </div>
      )}

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <div>
          <h4 className="text-white font-semibold mb-2">Diễn viên</h4>
          <p className="text-gray-300 text-sm">
            {movie.cast.join(', ')}
          </p>
        </div>
      )}

      {/* Director */}
      {movie.director && (
        <div>
          <h4 className="text-white font-semibold mb-2">Đạo diễn</h4>
          <p className="text-gray-300 text-sm">{movie.director}</p>
        </div>
      )}
    </div>
  )
}