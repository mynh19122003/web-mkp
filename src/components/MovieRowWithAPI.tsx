'use client'

import { useMovies } from '@/hooks/useMovies'
import MovieCard from './MovieCard'
import { useRef, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MovieRowWithAPIProps {
  title: string
  type?: 'new' | 'movie' | 'single' | 'series' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' | 'category'
  size?: 'small' | 'medium' | 'large'
  page?: number
  categorySlug?: string // Thêm categorySlug để lọc theo category từ API
  
  // 🏆 PHÂN LOẠI THEO RATING (Điểm đánh giá):
  // - "excellent" (>= 8.5) - Phim xuất sắc, masterpiece
  // - "high" (>= 8.0) - Phim chất lượng cao, đáng xem
  // - "good" (>= 7.0) - Phim tốt, giải trí
  // - "moderate" (6.0-7.9) - Phim ổn, xem được
  rating?: string
  
  // 👥 PHÂN LOẠI THEO VOTE COUNT (Độ phổ biến):
  // - "viral" (>= 5000) - Phim viral, siêu hot
  // - "popular" (>= 1000) - Phim phổ biến, nhiều người xem
  // - "trending" (>= 500) - Phim đang trending, hot
  // - "niche" (100-500) - Phim thích hợp, có fan riêng
  // - "fresh" (< 100) - Phim mới, ít người biết
  voteCount?: string
}

export default function MovieRowWithAPI({ 
  title, 
  type = 'new', 
  size = 'medium',
  page = 1,
  categorySlug,
  rating,
  voteCount 
}: MovieRowWithAPIProps) {
  const { movies, loading, error } = useMovies({ type, page, categorySlug, rating, voteCount })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isScrollable, setIsScrollable] = useState(false)

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (!scrollRef.current) return
      const { scrollWidth, clientWidth } = scrollRef.current
      setIsScrollable(scrollWidth > clientWidth)
    }

    checkScrollable()
    window.addEventListener('resize', checkScrollable)
    return () => window.removeEventListener('resize', checkScrollable)
  }, [movies])

  // Update arrow visibility on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  // Smooth scroll functions
  const scrollToLeft = useCallback(() => {
    if (!scrollRef.current) return
    const cardWidth = size === 'small' ? 180 : size === 'large' ? 320 : 240
    const scrollAmount = cardWidth * 3 // Scroll 3 cards at a time
    scrollRef.current.scrollTo({
      left: Math.max(0, scrollRef.current.scrollLeft - scrollAmount),
      behavior: 'smooth'
    })
  }, [size])

  const scrollToRight = useCallback(() => {
    if (!scrollRef.current) return
    const cardWidth = size === 'small' ? 180 : size === 'large' ? 320 : 240
    const scrollAmount = cardWidth * 3 // Scroll 3 cards at a time
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + scrollAmount,
      behavior: 'smooth'
    })
  }, [size])

  // Enhanced drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = 'grabbing'
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Smoother drag
    scrollRef.current.scrollLeft = scrollLeft - walk
    handleScroll() // Update arrows during drag
  }, [isDragging, startX, scrollLeft, handleScroll])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }, [])

  // Touch support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.2
    scrollRef.current.scrollLeft = scrollLeft - walk
    handleScroll()
  }, [isDragging, startX, scrollLeft, handleScroll])

  const handleTouchEnd = useCallback(() => {
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

      {/* Container with Navigation Arrows */}
      <div className="relative">
        {/* Left Arrow */}
        {isScrollable && showLeftArrow && (
          <button
            onClick={scrollToLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white rounded-full p-2 transition-all duration-300 opacity-0 group-hover/row:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20"
            style={{ transform: 'translateY(-50%)' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow */}
        {isScrollable && showRightArrow && (
          <button
            onClick={scrollToRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white rounded-full p-2 transition-all duration-300 opacity-0 group-hover/row:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20"
            style={{ transform: 'translateY(-50%)' }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Movies Scroll Container với Enhanced Drag & Touch */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 sm:px-6 lg:px-8 pb-4 cursor-grab active:cursor-grabbing select-none scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onScroll={handleScroll}
        >
          {movies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}-${type}`}
              className={`flex-shrink-0 transition-transform duration-300 hover:scale-105 ${
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
    </div>
  )
}