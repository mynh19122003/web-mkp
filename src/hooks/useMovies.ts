'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/types/movie'

interface UseMoviesOptions {
  type?: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' | 'search'
  page?: number
  keyword?: string
  autoFetch?: boolean
}

export const useMovies = (options: UseMoviesOptions = {}) => {
  const {
    type = 'new',
    page = 1,
    keyword = '',
    autoFetch = true
  } = options

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      const response = await fetch(`/api/movies?${params}`)
      const result = await response.json()

      if (result.success) {
        setMovies(result.data)
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tải phim')
      }
    } catch (err) {
      setError('Không thể kết nối đến server')
      console.error('Lỗi fetch movies:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchMovies()
    }
  }, [type, page, keyword, autoFetch])

  return {
    movies,
    loading,
    error,
    refetch: fetchMovies,
    setMovies
  }
}

// Hook riêng cho hero movies với content đầy đủ
export const useHeroMovies = (type: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' = 'cinema') => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHeroMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/hero-movies?type=${type}`)
      const result = await response.json()

      if (result.success) {
        setMovies(result.data)
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tải phim')
      }
    } catch (err) {
      setError('Không thể kết nối đến server')
      console.error('Lỗi fetch hero movies:', err)
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