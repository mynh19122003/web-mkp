'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Facebook, Twitter } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Đang xem "${title}" tại RoPhim`)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white font-semibold py-3 px-6 rounded hover:bg-gray-700 transition-colors flex items-center gap-3"
      >
        <Share2 className="w-6 h-6" />
        Chia Sẻ
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Menu */}
          <div className="absolute top-full mt-2 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-48">
            <div className="p-2">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
              </button>
              
              <button
                onClick={shareOnFacebook}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
              >
                <Facebook className="w-4 h-4 text-blue-500" />
                Chia sẻ Facebook
              </button>
              
              <button
                onClick={shareOnTwitter}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                Chia sẻ Twitter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}