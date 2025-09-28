'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useWatchlist(immediate = false) {
  const { data: session } = useSession()
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  // Fetch ngay nếu immediate = true
  useEffect(() => {
    if (session?.user && immediate && !fetched) {
      fetchWatchlist()
    } else if (!session?.user) {
      setWatchlist([])
      setFetched(false)
    }
  }, [session, immediate])

  const fetchWatchlist = async () => {
    if (!session?.user || fetched) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/watchlist')
      const data = await response.json()
      
      if (data.success) {
        setWatchlist(data.data)
        setFetched(true)
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = async (movieId: string) => {
    if (!session?.user) {
      alert('Vui lòng đăng nhập để thêm phim vào danh sách')
      return false
    }

    try {
      setLoading(true)
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      })

      const data = await response.json()
      
      if (data.success) {
        setWatchlist(data.data)
        return true
      } else {
        alert(data.error || 'Có lỗi xảy ra')
        return false
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      alert('Có lỗi xảy ra khi thêm vào danh sách')
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (movieId: string) => {
    if (!session?.user) return false

    try {
      setLoading(true)
      const response = await fetch(`/api/watchlist?movieId=${movieId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        setWatchlist(data.data)
        return true
      } else {
        alert(data.error || 'Có lỗi xảy ra')
        return false
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      alert('Có lỗi xảy ra khi xóa khỏi danh sách')
      return false
    } finally {
      setLoading(false)
    }
  }

  const isInWatchlist = (movieId: string) => {
    return watchlist.includes(movieId)
  }

  const checkAndFetch = () => {
    if (!fetched && session?.user) {
      fetchWatchlist()
    }
  }

  const toggleWatchlist = async (movieId: string) => {
    if (isInWatchlist(movieId)) {
      return await removeFromWatchlist(movieId)
    } else {
      return await addToWatchlist(movieId)
    }
  }

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    checkAndFetch,
    refetch: fetchWatchlist
  }
}