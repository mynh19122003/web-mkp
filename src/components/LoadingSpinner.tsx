'use client'

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  text = 'Đang tải...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className={`animate-spin text-red-600 ${sizeClasses[size]}`} />
      {text && (
        <p className={`text-gray-400 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}