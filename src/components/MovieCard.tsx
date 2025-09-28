import Link from 'next/link'
import Image from 'next/image'
import { Play, Clock } from 'lucide-react'
import { Movie } from '@/types/movie'
import SimpleWatchlistButton from './SimpleWatchlistButton'

interface MovieCardProps {
  movie: Movie
  size?: 'small' | 'medium' | 'large'
}

export default function MovieCard({ movie, size = 'medium' }: MovieCardProps) {
  const cardSizes = {
    small: 'w-full aspect-[16/9]',
    medium: 'w-full aspect-[2/3]', 
    large: 'w-full aspect-[16/9]'
  }

  return (
    <Link 
      href={`/phim/${movie.slug || movie.id}`} 
      className="group relative block rounded-lg overflow-hidden movie-card-hover hover:z-10"
      draggable={false}
    >
      <div className={`relative ${cardSizes[size]} overflow-hidden bg-gray-900`}>
        <Image
          src={movie.poster || movie.thumbnail || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image'}
          alt={movie.title}
          fill
          className="movie-poster object-cover object-center transition-transform duration-700 group-hover:scale-110"
          sizes={size === 'large' ? '(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 320px' : '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 240px'}
          quality={90}
          unoptimized
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg shimmer">
          {movie.quality}
        </div>

        {(movie.voteAverage || movie.imdbRating || movie.rating) > 0 ? (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            <div className="flex items-center space-x-1">
              <span>{movie.voteAverage ? 'TMDB' : 'IMDb'}</span>
              <span>{(movie.voteAverage || movie.imdbRating || movie.rating).toFixed(1)}</span>
            </div>
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            {movie.year}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white bg-opacity-20 backdrop-blur-netflix rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 glow-border">
            <Play className="w-8 h-8 text-white fill-current" />
          </div>
        </div>

        {movie.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-netflix">
          <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 text-shadow-hero">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/phim/${movie.slug || movie.id}`;
                }}
                className="bg-white text-black p-2 rounded-full hover:scale-110 transition-all duration-200 shimmer"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
              <SimpleWatchlistButton 
                movieId={movie.slug || movie.id} 
                movieTitle={movie.title}
                variant="icon"
                size="small"
              />
            </div>
            <span className="text-green-400 text-xs font-bold shimmer">
              {movie.isCompleted ? '100% phù hợp' : 'Đang cập nhật'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-white text-opacity-80 text-xs">
            <span>{movie.year}</span>
            {movie.duration > 0 && (
              <>
                <span>•</span>
                <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
              </>
            )}
            <span>•</span>
            <span className="bg-gray-700 px-1 rounded text-xs">{movie.quality || 'HD'}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="text-white text-opacity-70 text-xs"
              >
                {genre}
                {index < Math.min(movie.genres.length - 1, 2) && ' • '}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}