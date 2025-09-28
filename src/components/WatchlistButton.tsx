'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Check, Loader2 } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useSession } from 'next-auth/react'

interface WatchlistButtonProps {
  movieId: string
  movieTitle?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'button' | 'icon'
}

export default function WatchlistButton({ 
  movieId, 
  movieTitle,
  size = 'medium',
  variant = 'button' 
}: WatchlistButtonProps) {
  const { data: session } = useSession()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, loading, checkAndFetch } = useWatchlist()
  const [isToggling, setIsToggling] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Khởi tạo và kiểm tra trạng thái watchlist khi component mount
  useEffect(() => {
    if (session?.user && !initialized) {
      checkAndFetch()
      setInitialized(true)
    }
  }, [session, initialized, checkAndFetch])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này')
      return
    }

    setIsToggling(true)
    
    try {
      let success = false
      const currentlyInWatchlist = isInWatchlist(movieId)
      
      if (currentlyInWatchlist) {
        success = await removeFromWatchlist(movieId)
        if (success) {
          console.log(`Đã xóa "${movieTitle}" khỏi danh sách của tôi`)
        }
      } else {
        success = await addToWatchlist(movieId)
        if (success) {
          console.log(`Đã thêm "${movieTitle}" vào danh sách của tôi`)
        }
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    } finally {
      setIsToggling(false)
    }
  }

  const isLoading = loading || isToggling
  const inWatchlist = isInWatchlist(movieId)

  // Size configurations
  const sizeClasses = {
    small: 'h-8 px-2 text-xs',
    medium: 'h-10 px-4 text-sm',
    large: 'h-12 px-6 text-base'
  }

  const iconSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  const iconButtonSizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => {}}
        disabled={isLoading}
        className={`
          ${iconButtonSizeClasses[size]}
          rounded-full flex items-center justify-center
          ${inWatchlist 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-800/80 hover:bg-gray-700'
          }
          transition-all duration-200 backdrop-blur-sm
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={inWatchlist ? 'Xóa khỏi danh sách' : 'Thêm vào danh sách'}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizeClasses[size]} animate-spin`} />
        ) : inWatchlist ? (
          <Check className={iconSizeClasses[size]} />
        ) : (
          <Plus className={iconSizeClasses[size]} />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => {}}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        rounded-lg flex items-center gap-2 font-medium
        ${inWatchlist 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-gray-800/80 hover:bg-gray-700 text-white'
        }
        transition-all duration-200 backdrop-blur-sm
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizeClasses[size]} animate-spin`} />
      ) : inWatchlist ? (
        <Check className={iconSizeClasses[size]} />
      ) : (
        <Plus className={iconSizeClasses[size]} />
      )}
      
      {size !== 'small' && (
        <span>
          {inWatchlist ? 'Đã thêm' : 'Danh sách của tôi'}
        </span>
      )}
    </button>
  )
}