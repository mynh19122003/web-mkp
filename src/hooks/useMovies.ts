'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/types/movie'

interface UseMoviesOptions {
  type?: 'new' | 'movie' | 'single' | 'series' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' | 'search' | 'category'
  page?: number
  keyword?: string
  categorySlug?: string // Thêm categorySlug để lọc theo category
  rating?: string // Thêm rating filter
  voteCount?: string // Thêm voteCount filter
  autoFetch?: boolean
}

export const useMovies = (options: UseMoviesOptions = {}) => {
  const {
    type = 'new',
    page = 1,
    keyword = '',
    categorySlug = '',
    rating = '',
    voteCount = '',
    autoFetch = true
  } = options

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // SMART PRELOAD: Chỉ preload khi cần thiết
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload common endpoints based on current page
      const preloadTargets = [
        '/api/movies?type=new&page=1',
        '/api/movies?type=anime&page=1',
        '/api/hero-movies?type=cinema'
      ]
      
      // Staggered preloading để không block main thread
      preloadTargets.forEach((url, index) => {
        setTimeout(() => {
          fetch(url, { cache: 'force-cache' }).catch(() => {})
        }, index * 500) // 500ms intervals
      })
    }
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        type,
        page: page.toString(),
      })

      if (keyword && type === 'search') {
        params.append('keyword', keyword)
      }

      if (categorySlug && type === 'category') {
        params.append('categorySlug', categorySlug)
      }

      if (rating) {
        params.append('rating', rating)
      }

      if (voteCount) {
        params.append('voteCount', voteCount)
      }

      // OPTIMIZED: Enhanced fetch với caching và timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout

      const response = await fetch(`/api/movies?${params}`, {
        signal: controller.signal,
        cache: 'force-cache',
        next: { revalidate: 180 } // 3 minutes revalidation
      })
      
      clearTimeout(timeoutId)
      const result = await response.json()

      if (result.success) {
        setMovies(result.data)
        
        // Performance monitoring
        if (result.performance?.processingTime > 2000) {
          console.warn(`Slow API response: ${result.performance.processingTime}ms for type ${type}`)
        }
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tải phim')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout - Vui lòng thử lại')
      } else {
        setError('Không thể kết nối đến server')
      }
      console.error('Movies fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchMovies()
    }
  }, [type, page, keyword, categorySlug, rating, voteCount, autoFetch])

  return {
    movies,
    loading,
    error,
    refetch: fetchMovies,
    setMovies
  }
}

// OPTIMIZED: Hero movies hook with caching and preloading
export const useHeroMovies = (type: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' = 'cinema') => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)

  const fetchHeroMovies = async () => {
    try {
      setError(null)

      // Use aggressive caching with fetch
      const response = await fetch(`/api/hero-movies?type=${type}`, {
        next: { revalidate: 300 }, // 5 minutes cache
        cache: 'force-cache'
      })
      
      const result = await response.json()

      if (result.success) {
        setMovies(result.data)
        
        // Preload hero movie images in background
        result.data.forEach((movie: Movie) => {
          if (movie.thumbnail || movie.poster) {
            const img = new Image()
            img.src = movie.thumbnail || movie.poster
          }
        })
      } else {
        setError(result.error || 'Không thể tải hero movies')
      }
    } catch (err) {
      setError('Hero movies connection failed')
      console.error('Hero movies error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHeroMovies()
  }, [type])

  return {
    movies,
    loading,
    error,
    refetch: fetchHeroMovies
  }
}

export const useMovieDetail = (slug: string) => {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/movies/${slug}`)
        const result = await response.json()

        if (result.success) {
          setMovie(result.data)
        } else {
          setError(result.error || 'Không tìm thấy phim')
        }
      } catch (err) {
        setError('Không thể kết nối đến server')
        console.error('Lỗi fetch movie detail:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchMovieDetail()
    }
  }, [slug])

  return { movie, loading, error }
}