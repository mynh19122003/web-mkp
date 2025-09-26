'use client'

import { useMovies } from '@/hooks/useMovies'
import MovieCard from './MovieCard'
import { useRef, useState, useCallback } from 'react'

interface MovieRowWithAPIProps {
  title: string
  type?: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western'
  size?: 'small' | 'medium' | 'large'
  page?: number
}

export default function MovieRowWithAPI({ 
  title, 
  type = 'new', 
  size = 'medium',
  page = 1 
}: MovieRowWithAPIProps) {
  const { movies, loading, error } = useMovies({ type, page })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  if (loading) {
    return (
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-6 lg:px-8 text-shadow-hero">
          {title}
        </h2>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`flex-shrink-0 ${
                  size === 'large' 
                    ? 'w-[300px] h-[450px]' 
                    : size === 'small' 
                    ? 'w-[200px] h-[300px]' 
                    : 'w-[250px] h-[375px]'
                } bg-gray-800 rounded-lg animate-pulse skeleton`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-6 lg:px-8 text-shadow-hero">
          {title}
        </h2>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">Không thể tải phim: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <div className="group/row relative mb-12">
      {/* Section Title */}
      <h2 className="text-white text-2xl font-bold mb-4 px-4 sm:px-6 lg:px-8 text-shadow-hero">
        {title}
      </h2>

      {/* Movies Scroll Container với Mouse Drag */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 sm:px-6 lg:px-8 pb-4 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {movies.map((movie, index) => (
          <div
            key={`${movie.id}-${index}-${type}`}
            className={`flex-shrink-0 ${
              size === 'small' 
                ? 'w-[160px] sm:w-[180px]' 
                : size === 'large'
                ? 'w-[280px] sm:w-[320px]'
                : 'w-[200px] sm:w-[240px]'
            }`}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  )
}