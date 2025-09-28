'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Volume2, VolumeX, Plus, ThumbsUp } from 'lucide-react'
import { Movie } from '@/types/movie'
import { useHeroMovies } from '@/hooks/useMovies'

export default function HeroSection() {
  // Lấy phim chiếu rạp từ PhimAPI
  const { movies: apiMovies, loading } = useHeroMovies('cinema')
  const heroMovies = apiMovies.length > 0 ? apiMovies.slice(0, 5) : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (heroMovies.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === heroMovies.length - 1 ? 0 : prevIndex + 1
      )
    }, 8000) // Tăng thời gian để user có thể đọc content

    return () => clearInterval(timer)
  }, [heroMovies.length])



  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </section>
    )
  }

  if (heroMovies.length === 0) return null

  const currentMovie = heroMovies[currentIndex]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentMovie.thumbnail || currentMovie.poster || 'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg'}
          alt={currentMovie.title}
          fill
          className="object-cover object-center"
          priority
          quality={90}
          unoptimized
          sizes="100vw"
        />
        {/* Gradient Overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Movie Content Info */}
      <div className="absolute inset-0 z-20">
        <div className="container mx-auto h-full flex flex-col justify-center px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Movie Title - Balanced size */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow-hero leading-tight">
              {currentMovie.title.toUpperCase()}
            </h1>
            
            {/* Original Title - Smaller subtitle */}
            {currentMovie.originalTitle && currentMovie.originalTitle !== currentMovie.title && (
              <h2 className="text-lg sm:text-xl text-gray-300 mb-6 text-shadow-hero font-light">
                {currentMovie.originalTitle}
              </h2>
            )}
            
            {/* Movie Details Row - Tags like the reference */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Rating Badge - Ưu tiên TMDB vote_average, rồi IMDb */}
              {(currentMovie.voteAverage || currentMovie.imdbRating || currentMovie.rating) > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-md font-bold text-sm">
                  <span>{currentMovie.voteAverage ? 'TMDB' : 'IMDb'}</span>
                  <span>{(currentMovie.voteAverage || currentMovie.imdbRating || currentMovie.rating).toFixed(1)}</span>
                  {currentMovie.voteCount && currentMovie.voteCount > 10 && (
                    <span className="text-xs opacity-75">({currentMovie.voteCount})</span>
                  )}
                </div>
              )}
              
              {/* Age Rating */}
              <div className="bg-gray-600 text-white px-3 py-1 rounded-md font-bold text-sm">
                T18
              </div>
              
              {/* Year */}
              <div className="bg-gray-700 text-white px-3 py-1 rounded-md font-bold text-sm">
                {currentMovie.year}
              </div>
              
              {/* Episodes count for TV series */}
              {currentMovie.totalEpisodes && currentMovie.totalEpisodes > 0 && (
                <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-sm">
                  {currentMovie.currentEpisode && currentMovie.currentEpisode > 0 
                    ? `Tập ${currentMovie.currentEpisode}/${currentMovie.totalEpisodes}`
                    : `${currentMovie.totalEpisodes} tập`
                  }
                </div>
              )}
              
              {/* Quality */}
              <div className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm">
                {currentMovie.quality}
              </div>
            </div>

            {/* Genre Tags Row */}
            <div className="flex flex-wrap gap-2 mb-5">
              {currentMovie.genres.slice(0, 4).map((genre: string, index: number) => (
                <div
                  key={index}
                  className="bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30 text-sm font-medium"
                >
                  {genre}
                </div>
              ))}
            </div>

            {/* Description - From API content field */}
            {currentMovie.description && (
              <div className="mb-6">
                <p className="text-white/90 text-base leading-relaxed max-w-2xl text-shadow mb-3">
                  {currentMovie.description.length > 200 
                    ? currentMovie.description.substring(0, 200) + '...'
                    : currentMovie.description
                  }
                </p>
                
                {/* Movie Status for TV Series */}
                {currentMovie.type === 'tv' && (
                  <div className="mb-4">
                    <p className="text-white/80 text-base">
                      <span className="font-semibold text-white">Trạng thái:</span>{' '}
                      {currentMovie.isCompleted ? 'Hoàn thành' : 'Đang cập nhật'}
                      {currentMovie.currentEpisode && currentMovie.totalEpisodes && (
                        <span className="ml-2 text-yellow-400">
                          (Tập {currentMovie.currentEpisode}/{currentMovie.totalEpisodes})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                {/* Additional Info */}
                <div className="text-white/70 text-sm space-y-1">
                  {currentMovie.director && (
                    <p>
                      <span className="font-semibold text-white">Đạo diễn:</span> {currentMovie.director}
                    </p>
                  )}
                  {currentMovie.cast && currentMovie.cast.length > 0 && (
                    <p>
                      <span className="font-semibold text-white">Diễn viên:</span>{' '}
                      {currentMovie.cast.slice(0, 3).join(', ')}
                      {currentMovie.cast.length > 3 && '...'}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold text-white">Quốc gia:</span> {currentMovie.country}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href={`/phim/${currentMovie.slug || currentMovie.id}`}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-bold text-base hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                Phát
              </Link>
              <Link
                href={`/phim/${currentMovie.slug || currentMovie.id}`}
                className="flex items-center gap-2 bg-gray-600/70 text-white px-6 py-3 rounded-md font-bold text-base hover:bg-gray-600/90 transition-colors backdrop-blur-sm"
              >
                <Info className="w-5 h-5" />
                Thông tin thêm
              </Link>
              <button className="bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 border border-white/20 hover:scale-110">
                <Plus className="w-5 h-5" />
              </button>
              <button className="bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 border border-white/20 hover:scale-110">
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>


          </div>
        </div>
      </div>

      {/* Thumbnail Navigation - Bottom Right */}
      {heroMovies.length > 1 && (
        <div className="absolute bottom-8 right-8 z-30 flex gap-2">
          {heroMovies.slice(0, 5).map((movie: Movie, index: number) => (
            <div
              key={movie.id}
              className={`relative w-16 h-24 rounded cursor-pointer transition-all duration-300 border-2 ${
                index === currentIndex 
                  ? 'border-red-600 opacity-100 scale-110' 
                  : 'border-transparent opacity-60 hover:opacity-80'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={movie.poster || movie.thumbnail || 'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg'}
                alt={movie.title}
                fill
                className="object-cover rounded"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Slide Indicators - Bottom Center */}
      {heroMovies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
          {heroMovies.map((_: Movie, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 h-2 bg-white rounded-full' 
                  : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Volume Control */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-24 right-6 z-20 bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-70 text-white p-3 rounded-full transition-colors border border-white border-opacity-20"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>



    </section>
  )
}
