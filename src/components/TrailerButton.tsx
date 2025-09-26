'use client'

import { useState } from 'react'
import { Play, X, Volume2, VolumeX } from 'lucide-react'

interface TrailerModalProps {
  trailerUrl?: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export default function TrailerModal({ trailerUrl, title, isOpen, onClose }: TrailerModalProps) {
  const [isMuted, setIsMuted] = useState(true)

  if (!isOpen || !trailerUrl) return null

  // Extract YouTube video ID if it's a YouTube URL
  const getYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const youtubeId = getYouTubeId(trailerUrl)
  const embedUrl = youtubeId 
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0`
    : trailerUrl

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h3 className="text-lg font-semibold text-white">
            Trailer - {title}
          </h3>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Content */}
        <div className="relative aspect-video">
          {youtubeId ? (
            <iframe
              src={embedUrl}
              title={`Trailer ${title}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={trailerUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted={isMuted}
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          )}
        </div>
      </div>
    </div>
  )
}

interface TrailerButtonProps {
  trailerUrl?: string
  title: string
}

export function TrailerButton({ trailerUrl, title }: TrailerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!trailerUrl) return null

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white font-semibold py-3 px-6 rounded hover:bg-gray-700 transition-all duration-200 flex items-center gap-3 hover:scale-105"
      >
        <Play className="w-6 h-6" />
        Trailer
      </button>

      <TrailerModal
        trailerUrl={trailerUrl}
        title={title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}