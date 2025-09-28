'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Download } from 'lucide-react'

interface VideoPlayerProps {
  src?: string
  videoUrl?: string
  title: string
  thumbnail?: string
  poster?: string
}

export default function VideoPlayer({ src, videoUrl, title, thumbnail, poster }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  const finalVideoUrl = src || videoUrl
  const finalPoster = poster || thumbnail

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!finalVideoUrl) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
        {finalPoster && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${finalPoster})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 mb-4">
              <Play className="w-12 h-12 text-white fill-current" />
            </div>
            <p className="text-white text-lg font-semibold">Video chưa khả dụng</p>
            <p className="text-gray-300 text-sm mt-2">Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
      {/* Video Element */}
      <video
        className="w-full h-full object-cover"
        poster={finalPoster}
        muted={isMuted}
        controls
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <source src={finalVideoUrl} type="application/x-mpegURL" />
        <source src={finalVideoUrl} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>

      {/* Play/Pause Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 transition-all duration-300 transform hover:scale-110">
            <Play className="w-12 h-12 text-white fill-current" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 fill-current" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>

            <span className="text-white text-sm">
              {title}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="text-white hover:text-gray-300 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="text-white hover:text-gray-300 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-white hover:text-gray-300 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full h-1 bg-gray-600 rounded-full">
            <div className="h-full bg-red-600 rounded-full" style={{ width: '30%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}