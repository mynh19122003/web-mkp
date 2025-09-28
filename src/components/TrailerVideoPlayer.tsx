'use client'

import { useState } from 'react'
import Image from 'next/image' 
import { Play, Volume2, VolumeX, Maximize } from 'lucide-react'

interface TrailerVideoPlayerProps {
  trailerUrl: string
  title: string
  thumbnail: string
}

export default function TrailerVideoPlayer({ trailerUrl, title, thumbnail }: TrailerVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Extract YouTube video ID if it's a YouTube URL
  const getYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const youtubeId = getYouTubeId(trailerUrl)
  const embedUrl = youtubeId 
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&showinfo=0`
    : trailerUrl

  if (!trailerUrl) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🎬</div>
          <p className="text-gray-400">Trailer không khả dụng</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl">
      {!isPlaying ? (
        // Thumbnail with play button
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          <Image
            src={thumbnail}
            alt={`${title} trailer`}
            fill
            className="object-cover"
            unoptimized
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 hover:bg-red-700 rounded-full p-6 transition-all duration-300 group-hover:scale-110 shadow-2xl">
              <Play className="w-12 h-12 text-white fill-current ml-1" />
            </div>
          </div>
          
          {/* Trailer badge */}
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            TRAILER
          </div>
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-white text-xl font-bold mb-2">
              {title} - Official Trailer
            </h3>
            <p className="text-gray-300">
              Click để xem trailer chính thức
            </p>
          </div>
        </div>
      ) : (
        // Video player
        <div className="relative w-full h-full">
          {/* Control buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMuted(!isMuted)
              }}
              className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>

          {youtubeId ? (
            <iframe
              src={embedUrl}
              title={`${title} Trailer`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={trailerUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted={isMuted}
              playsInline
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          )}
          
          {/* Back to thumbnail button */}
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute bottom-4 left-4 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded text-sm transition-all duration-200"
          >
            ← Quay lại
          </button>
        </div>
      )}
    </div>
  )
}