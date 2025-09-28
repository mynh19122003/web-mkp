'use client'

import { useState, useCallback } from 'react'

export interface UseSimpleWatchlistReturn {
  watchlist: string[]
  isInWatchlist: (movieId: string) => boolean
  addToWatchlist: (movieId: string) => Promise<boolean>
  removeFromWatchlist: (movieId: string) => Promise<boolean>
  refreshWatchlist: () => Promise<void>
  loading: boolean
  error: string | null
}

// DEPRECATED: This hook is disabled. Use the main /api/watchlist API instead.
export function useSimpleWatchlist(): UseSimpleWatchlistReturn {
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>('This hook is deprecated. Use main watchlist API instead.')

  const isInWatchlist = useCallback((movieId: string) => {
    return false // Always return false since this is disabled
  }, [])

  const addToWatchlist = useCallback(async (movieId: string) => {
    console.warn('useSimpleWatchlist: Deprecated - use main /api/watchlist instead')
    return false
  }, [])

  const removeFromWatchlist = useCallback(async (movieId: string) => {
    console.warn('useSimpleWatchlist: Deprecated - use main /api/watchlist instead')
    return false
  }, [])

  const refreshWatchlist = useCallback(async () => {
    console.warn('useSimpleWatchlist: Deprecated - use main /api/watchlist instead')
  }, [])

  return {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    refreshWatchlist,
    loading,
    error
  }
}