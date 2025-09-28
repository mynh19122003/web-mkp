'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useWatchlist } from '@/contexts/WatchlistContext'

interface SimpleWatchlistButtonProps {
  movieId: string
  movieTitle?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'button' | 'icon'
}

export default function SimpleWatchlistButton({ 
  movieId, 
  movieTitle,
  size = 'medium',
  variant = 'button' 
}: SimpleWatchlistButtonProps) {
  const { data: session } = useSession()
  const { watchlistStatus, toggleWatchlist, checkWatchlistStatus } = useWatchlist()
  const [isToggling, setIsToggling] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  
  const isInWatchlist = watchlistStatus[movieId] || false
  const isDisabled = isToggling || !session

  // Check watchlist status on first hover/focus
  const handleCheckStatus = async () => {
    if (!hasChecked && session?.user?.email && movieId) {
      setHasChecked(true)
      await checkWatchlistStatus([movieId])
    }
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user?.email) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này')
      return
    }

    setIsToggling(true)
    
    try {
      const success = await toggleWatchlist(movieId, movieTitle)
      
      if (!success) {
        alert('Có lỗi xảy ra, vui lòng thử lại')
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsToggling(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-1.5'
      case 'large':
        return 'p-4'
      default:
        return 'p-2'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'w-3 h-3'
      case 'large':
        return 'w-6 h-6'
      default:
        return 'w-4 h-4'
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={handleCheckStatus}
        onFocus={handleCheckStatus}
        disabled={isDisabled}
        className={`
          ${getSizeClasses()} 
          bg-gray-700 bg-opacity-80 text-white rounded-full 
          hover:bg-gray-600 transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isInWatchlist ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}
        `}
        title={isInWatchlist ? `Xóa "${movieTitle}" khỏi danh sách` : `Thêm "${movieTitle}" vào danh sách`}
      >
        {isDisabled ? (
          <Loader2 className={`${getIconSize()} animate-spin`} />
        ) : isInWatchlist ? (
          <Check className={getIconSize()} />
        ) : (
          <Plus className={getIconSize()} />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleCheckStatus}
      onFocus={handleCheckStatus}
      disabled={isDisabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isInWatchlist 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-gray-700 hover:bg-gray-600 text-white'
        }
      `}
    >
      {isDisabled ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          {isInWatchlist ? (
            <>
              <Check className="w-4 h-4" />
              Đã lưu
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Thêm vào danh sách
            </>
          )}
        </>
      )}
    </button>
  )
}