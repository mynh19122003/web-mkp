'use client'

import { useEffect } from 'react'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { useSession } from 'next-auth/react'
import { Movie } from '@/types/movie'

interface WatchlistCheckerProps {
  movies: Movie[]
  lazy?: boolean // Only check on user interaction
}

export default function WatchlistChecker({ movies, lazy = true }: WatchlistCheckerProps) {
  const { data: session } = useSession()
  const { checkWatchlistStatus } = useWatchlist()

  useEffect(() => {
    // If lazy loading is enabled, don't auto-check
    if (lazy || !session?.user?.email || movies.length === 0) return

    const movieIds = movies
      .map(movie => movie.slug || movie.id)
      .filter(Boolean)
    
    if (movieIds.length > 0) {
      // Long debounce to reduce API calls
      const timeoutId = setTimeout(() => {
        checkWatchlistStatus(movieIds)
      }, 2000) // 2 second delay

      return () => clearTimeout(timeoutId)
    }
  }, [movies, session?.user?.email, checkWatchlistStatus, lazy])

  return null // Component này chỉ để check, không render gì
}