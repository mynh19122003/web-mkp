'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { formatMovieType } from '@/lib/utils'

interface MovieDetailsProps {
  movie: {
    title: string
    description: string
    genres: string[]
    director?: string
    cast?: string[]
    country: string
    year: number
    duration: number
    type?: string
    apiType?: string
  }
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  const shortDescription = movie.description.length > 300 
    ? movie.description.substring(0, 300) + '...'
    : movie.description

  return (
    <div className="space-y-6">
      {/* Story/Plot */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-red-500" />
          Nội Dung Phim
        </h3>
        <div className="bg-gray-900 rounded-lg p-6">
          <p className="text-gray-300 leading-relaxed mb-4">
            {showFullDescription ? movie.description : shortDescription}
          </p>
          
          {movie.description.length > 300 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-red-500 hover:text-red-400 font-medium flex items-center gap-2 transition-colors"
            >
              {showFullDescription ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Xem thêm
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Genres & Categories */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-red-500">Thể Loại</h4>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre, index) => (
              <span
                key={index}
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Production Info */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-red-500">Thông Tin Sản Xuất</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Quốc gia:</span>
              <span className="text-white font-medium">{movie.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Năm sản xuất:</span>
              <span className="text-white font-medium">{movie.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Thời lượng:</span>
              <span className="text-white font-medium">{movie.duration} phút</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Loại phim:</span>
              <span className="text-white font-medium">{formatMovieType(movie.apiType, movie.type)}</span>
            </div>
            {movie.director && (
              <div className="flex justify-between">
                <span className="text-gray-400">Đạo diễn:</span>
                <span className="text-white font-medium">{movie.director}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-red-500">Diễn Viên Chính</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {movie.cast.slice(0, 8).map((actor, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-400">
                    {actor.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-white truncate">{actor}</p>
              </div>
            ))}
          </div>
          
          {movie.cast.length > 8 && (
            <p className="text-gray-400 text-sm mt-4 text-center">
              Và {movie.cast.length - 8} diễn viên khác...
            </p>
          )}
        </div>
      )}
    </div>
  )
}