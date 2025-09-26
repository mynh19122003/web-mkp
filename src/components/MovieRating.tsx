'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageCircle, User } from 'lucide-react'

interface MovieRatingProps {
  rating: number
  imdbRating?: number
  views?: number
  title: string
}

export default function MovieRating({ rating, imdbRating, views, title }: MovieRatingProps) {
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleRatingClick = (star: number) => {
    setUserRating(star)
  }

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < count ? 'text-yellow-500 fill-current' : 'text-gray-400'
        }`}
      />
    ))
  }

  const renderInteractiveStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => handleRatingClick(index + 1)}
        onMouseEnter={() => setHoveredRating(index + 1)}
        onMouseLeave={() => setHoveredRating(0)}
        className="transition-colors"
      >
        <Star
          className={`w-6 h-6 ${
            index < (hoveredRating || userRating)
              ? 'text-yellow-500 fill-current' 
              : 'text-gray-400 hover:text-yellow-300'
          }`}
        />
      </button>
    ))
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold mb-4">Đánh Giá Phim</h3>
      
      {/* Current Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IMDb Rating */}
        {imdbRating && (
          <div className="text-center p-4 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
            <div className="text-2xl font-bold text-yellow-500 mb-2">
              {imdbRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(imdbRating / 2))}
            </div>
            <p className="text-sm text-gray-300">IMDb Rating</p>
          </div>
        )}

        {/* Site Rating */}
        <div className="text-center p-4 bg-red-600/20 rounded-lg border border-red-600/30">
          <div className="text-2xl font-bold text-red-500 mb-2">
            {rating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(rating / 2))}
          </div>
          <p className="text-sm text-gray-300">RoPhim Rating</p>
          {views && (
            <p className="text-xs text-gray-400 mt-1">
              {views.toLocaleString()} lượt xem
            </p>
          )}
        </div>
      </div>

      {/* User Rating */}
      <div className="border-t border-gray-800 pt-6">
        <h4 className="text-lg font-semibold mb-4">Đánh Giá Của Bạn</h4>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-gray-400">Đánh giá:</span>
          <div className="flex gap-1">
            {renderInteractiveStars()}
          </div>
          {userRating > 0 && (
            <span className="text-sm text-yellow-500 font-medium">
              {userRating}/5 sao
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded transition-colors border border-green-600/30">
            <ThumbsUp className="w-4 h-4" />
            Thích ({Math.floor(Math.random() * 100) + 50})
          </button>
          
          <button className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded transition-colors border border-red-600/30">
            <ThumbsDown className="w-4 h-4" />
            Không thích ({Math.floor(Math.random() * 20) + 5})
          </button>
          
          <button className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded transition-colors border border-blue-600/30">
            <MessageCircle className="w-4 h-4" />
            Bình luận
          </button>
        </div>
      </div>

      {/* Sample Reviews */}
      <div className="border-t border-gray-800 pt-6">
        <h4 className="text-lg font-semibold mb-4">Bình Luận Gần Đây</h4>
        <div className="space-y-4">
          {/* Sample Review 1 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-white">MovieLover123</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(4)}
                  </div>
                  <span className="text-xs text-gray-400">2 giờ trước</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Phim hay, diễn xuất tốt và kịch bản hấp dẫn. Đáng xem!
            </p>
          </div>

          {/* Sample Review 2 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-white">PhimFan2024</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(5)}
                  </div>
                  <span className="text-xs text-gray-400">1 ngày trước</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Tuyệt vời! Một trong những bộ phim hay nhất tôi từng xem.
            </p>
          </div>
        </div>
        
        <button className="mt-4 text-red-500 hover:text-red-400 text-sm font-medium">
          Xem tất cả bình luận →
        </button>
      </div>
    </div>
  )
}