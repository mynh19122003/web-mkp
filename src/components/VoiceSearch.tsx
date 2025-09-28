'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

// Add type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: (() => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

interface VoiceSearchProps {
  onResult: (transcript: string) => void
  onError?: (error: string) => void
  disabled?: boolean
}

export default function VoiceSearch({ onResult, onError, disabled = false }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'vi-VN' // Vietnamese language
        
        recognition.onstart = () => {
          setIsListening(true)
          setTranscript('')
        }
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsListening(false)
          const errorMessage = getErrorMessage(event.error)
          onError?.(errorMessage)
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ''
          let interimTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              finalTranscript += result[0].transcript
            } else {
              interimTranscript += result[0].transcript
            }
          }
          
          const currentTranscript = finalTranscript || interimTranscript
          setTranscript(currentTranscript)
          
          if (finalTranscript) {
            onResult(finalTranscript.trim())
            setIsListening(false)
          }
        }
        
        recognitionRef.current = recognition
      }
    }
  }, [onResult, onError])

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'network':
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.'
      case 'not-allowed':
        return 'Vui lòng cho phép truy cập microphone để sử dụng tìm kiếm bằng giọng nói.'
      case 'no-speech':
        return 'Không phát hiện giọng nói. Vui lòng thử lại.'
      case 'aborted':
        return 'Tìm kiếm bằng giọng nói đã bị hủy.'
      case 'audio-capture':
        return 'Không thể truy cập microphone.'
      case 'service-not-allowed':
        return 'Dịch vụ nhận dạng giọng nói không khả dụng.'
      default:
        return 'Có lỗi xảy ra khi nhận dạng giọng nói.'
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening && !disabled) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        onError?.('Không thể khởi động nhận dạng giọng nói.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return null // Don't render if not supported
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`p-2 rounded-full transition-all duration-200 ${
          isListening
            ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/25'
            : disabled
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
        title={
          isListening 
            ? 'Đang nghe... (nhấn để dừng)'
            : disabled
            ? 'Tìm kiếm bằng giọng nói không khả dụng'
            : 'Tìm kiếm bằng giọng nói'
        }
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>

      {/* Listening Indicator */}
      {isListening && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 backdrop-blur-md text-white px-3 py-2 rounded-lg shadow-lg z-50 min-w-max">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm">
              {transcript || 'Đang nghe...'}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Nói tên phim bạn muốn tìm
          </div>
        </div>
      )}
    </div>
  )
}

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}