// Demo component để test smooth scrolling
'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SmoothScrollDemo() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Sample data
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Phim ${i + 1}`,
    color: `hsl(${(i * 36) % 360}, 70%, 50%)`
  }))

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 5)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5)
  }, [])

  const scrollToLeft = useCallback(() => {
    if (!scrollRef.current) return
    const scrollAmount = 300 * 3 // 3 cards width
    scrollRef.current.scrollTo({
      left: Math.max(0, scrollRef.current.scrollLeft - scrollAmount),
      behavior: 'smooth'
    })
  }, [])

  const scrollToRight = useCallback(() => {
    if (!scrollRef.current) return
    const scrollAmount = 300 * 3 // 3 cards width
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + scrollAmount,
      behavior: 'smooth'
    })
  }, [])

  // Enhanced drag with momentum
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = 'grabbing'
    scrollRef.current.style.userSelect = 'none'
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.2 // Smooth drag multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk
    handleScroll()
  }, [isDragging, startX, scrollLeft, handleScroll])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
      scrollRef.current.style.userSelect = 'auto'
    }
  }, [])

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.0
    scrollRef.current.scrollLeft = scrollLeft - walk
    handleScroll()
  }, [isDragging, startX, scrollLeft, handleScroll])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    handleScroll()
  }, [handleScroll])

  return (
    <div className="py-8 bg-black min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-3xl font-bold mb-8 text-center">
          🎬 Smooth Scroll Demo
        </h1>
        
        <div className="group/row relative">
          <h2 className="text-white text-xl font-bold mb-4">
            Netflix-Style Smooth Scrolling
          </h2>

          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollToLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 opacity-0 group-hover/row:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollToRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 opacity-0 group-hover/row:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 cursor-grab active:cursor-grabbing select-none px-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onScroll={handleScroll}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[280px] h-[420px] rounded-lg transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
                style={{ backgroundColor: item.color }}
                draggable={false}
              >
                <div className="p-6 h-full flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                  <h3 className="text-white font-bold text-xl mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Mô tả ngắn về bộ phim này. Đây là demo smooth scrolling.
                  </p>
                  <div className="flex items-center space-x-2 mt-4">
                    <button className="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">
                      ▶ Phát
                    </button>
                    <button className="bg-gray-700/80 text-white px-4 py-2 rounded-full hover:bg-gray-600/80 transition-colors">
                      + Danh sách
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            ✨ Kéo thả mượt mà • 📱 Hỗ trợ touch • 🖱️ Nút điều hướng • 🎯 Snap scrolling
          </p>
        </div>
      </div>
    </div>
  )
}