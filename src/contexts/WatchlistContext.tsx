'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface WatchlistContextType {
  watchlistStatus: Record<string, boolean>
  isLoading: boolean
  checkWatchlistStatus: (movieIds: string[]) => Promise<void>
  toggleWatchlist: (movieId: string, movieTitle?: string) => Promise<boolean>
  clearCache: () => void
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

interface WatchlistProviderProps {
  children: ReactNode
}

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const { data: session } = useSession()
  const [watchlistStatus, setWatchlistStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [pendingChecks, setPendingChecks] = useState<Set<string>>(new Set())

  // Optimized: Only check watchlist on user interaction, not automatically
  const checkWatchlistStatus = async (movieIds: string[]) => {
    if (!session?.user?.email || movieIds.length === 0) return

    // Filter out movies we already know about and aren't currently checking
    const newMovieIds = movieIds.filter(id => 
      !(id in watchlistStatus) && !pendingChecks.has(id)
    )

    if (newMovieIds.length === 0) return

    // Mark these movies as being checked
    setPendingChecks(prev => {
      const newSet = new Set(prev)
      newMovieIds.forEach(id => newSet.add(id))
      return newSet
    })

    setIsLoading(true)

    try {
      // For now, use individual API calls but with debouncing
      const promises = newMovieIds.slice(0, 10).map(async (movieId) => {
        try {
          const response = await fetch(`/api/watchlist/check?movieId=${movieId}`)
          if (response.ok) {
            const data = await response.json()
            return { [movieId]: data.isInWatchlist || false }
          }
        } catch (error) {
          console.error(`Error checking watchlist for ${movieId}:`, error)
        }
        return { [movieId]: false }
      })

      const results = await Promise.all(promises)
      const combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {})

      setWatchlistStatus(prev => ({
        ...prev,
        ...combinedResults
      }))
    } catch (error) {
      console.error('Error checking watchlist status:', error)
      // Set default false for failed checks
      const defaultStatus: Record<string, boolean> = {}
      newMovieIds.forEach(id => defaultStatus[id] = false)
      setWatchlistStatus(prev => ({ ...prev, ...defaultStatus }))
    } finally {
      setIsLoading(false)
      // Remove from pending checks
      setPendingChecks(prev => {
        const newSet = new Set(prev)
        newMovieIds.forEach(id => newSet.delete(id))
        return newSet
      })
    }
  }

  // Toggle watchlist status
  const toggleWatchlist = async (movieId: string, movieTitle?: string): Promise<boolean> => {
    if (!session?.user?.email) return false

    const currentStatus = watchlistStatus[movieId] || false
    
    // Optimistic update
    setWatchlistStatus(prev => ({
      ...prev,
      [movieId]: !currentStatus
    }))

    try {
      let response
      if (currentStatus) {
        // Remove from watchlist
        response = await fetch(`/api/watchlist?movieId=${movieId}`, {
          method: 'DELETE'
        })
      } else {
        // Add to watchlist
        response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId })
        })
      }

      if (response.ok) {
        console.log(currentStatus 
          ? `Đã xóa "${movieTitle}" khỏi danh sách` 
          : `Đã thêm "${movieTitle}" vào danh sách`
        )
        return true
      } else {
        // Revert optimistic update
        setWatchlistStatus(prev => ({
          ...prev,
          [movieId]: currentStatus
        }))
        return false
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
      // Revert optimistic update
      setWatchlistStatus(prev => ({
        ...prev,
        [movieId]: currentStatus
      }))
      return false
    }
  }

  const clearCache = () => {
    setWatchlistStatus({})
    setPendingChecks(new Set())
  }

  // Clear cache when user logs out
  useEffect(() => {
    if (!session?.user?.email) {
      clearCache()
    }
  }, [session?.user?.email])

  const value: WatchlistContextType = {
    watchlistStatus,
    isLoading,
    checkWatchlistStatus,
    toggleWatchlist,
    clearCache
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    // Return default values instead of throwing error to prevent crashes
    return {
      watchlistStatus: {},
      isLoading: false,
      checkWatchlistStatus: async () => {},
      toggleWatchlist: async () => false,
      clearCache: () => {}
    }
  }
  return context
}