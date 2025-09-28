'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Movie } from '@/types/movie'
import HLSVideoPlayer from '@/components/HLSVideoPlayer'
import EpisodeList from '@/components/EpisodeList'
import MovieInfo from '@/components/MovieInfo'
import LoadingSpinner from '@/components/LoadingSpinner'
import { PhimAPIService } from '@/services/kkphim'
import { ArrowLeft, Settings, Download, Share2 } from 'lucide-react'
import Link from 'next/link'

interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: number;
  videoUrl: string;
  thumbnail: string;
}

interface ServerGroup {
  serverName: string;
  episodes: Episode[];
}

export default function WatchPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const episodeParam = searchParams.get('episode') || '1'
  const serverParam = searchParams.get('server') || '0'

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [currentServer, setCurrentServer] = useState(0)
  const [servers, setServers] = useState<ServerGroup[]>([])

  useEffect(() => {
    if (slug) {
      fetchMovieDetails()
    }
  }, [slug])

  useEffect(() => {
    if (servers.length > 0) {
      const serverIndex = parseInt(serverParam)
      const episodeNumber = parseInt(episodeParam)
      
      if (servers[serverIndex]) {
        setCurrentServer(serverIndex)
        const episode = servers[serverIndex].episodes.find(ep => ep.episodeNumber === episodeNumber)
        if (episode) {
          setCurrentEpisode(episode)
        } else if (servers[serverIndex].episodes.length > 0) {
          setCurrentEpisode(servers[serverIndex].episodes[0])
        }
      }
    }
  }, [servers, episodeParam, serverParam])

  const fetchMovieDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`🎬 Fetching movie details for slug: ${slug}`)
      const movieData = await PhimAPIService.getMovieDetail(slug)
      
      if (!movieData) {
        throw new Error('Không tìm thấy phim')
      }

      setMovie(movieData)
      
      // Transform episodes data
      if (movieData.episodes && Array.isArray(movieData.episodes)) {
        const transformedServers = movieData.episodes.map((serverGroup: any) => ({
          serverName: serverGroup.serverName || 'Server #1',
          episodes: serverGroup.episodes || []
        }))
        setServers(transformedServers)
        
        console.log(`📺 Found ${transformedServers.length} servers with episodes`)
      } else {
        // Nếu không có episodes, tạo episode đơn lẻ
        if (movieData.videoUrl) {
          const singleEpisode: Episode = {
            id: '1',
            episodeNumber: 1,
            title: 'Tập duy nhất',
            duration: movieData.duration || 0,
            videoUrl: movieData.videoUrl,
            thumbnail: movieData.poster
          }
          setServers([{
            serverName: 'Server #1',
            episodes: [singleEpisode]
          }])
          setCurrentEpisode(singleEpisode)
        }
      }
      
    } catch (error) {
      console.error('Error fetching movie:', error)
      setError('Không thể tải thông tin phim. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const handleEpisodeChange = (episode: Episode, serverIndex: number) => {
    setCurrentEpisode(episode)
    setCurrentServer(serverIndex)
    
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('episode', episode.episodeNumber.toString())
    url.searchParams.set('server', serverIndex.toString())
    window.history.replaceState({}, '', url.toString())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Oops! Có lỗi xảy ra</h1>
          <p className="text-gray-400 mb-6">{error || 'Không tìm thấy phim'}</p>
          <Link 
            href="/"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/phim/${slug}`}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{movie.title}</h1>
                {currentEpisode && (
                  <p className="text-sm text-gray-400">
                    {currentEpisode.title} • {servers[currentServer]?.serverName}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            {currentEpisode?.videoUrl ? (
              <HLSVideoPlayer 
                src={currentEpisode.videoUrl}
                poster={movie.poster}
                title={`${movie.title} - ${currentEpisode.title}`}
                onEnded={() => {
                  // Auto play next episode
                  const episodes = servers[currentServer]?.episodes || []
                  const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id)
                  if (currentIndex >= 0 && currentIndex < episodes.length - 1) {
                    handleEpisodeChange(episodes[currentIndex + 1], currentServer)
                  }
                }}
              />
            ) : (
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Không có video để phát</p>
              </div>
            )}
            
            {/* Movie Info below video on large screens */}
            <div className="mt-6 lg:block hidden">
              <MovieInfo movie={movie} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Episode List */}
            {servers.length > 0 && (
              <EpisodeList 
                servers={servers}
                currentEpisode={currentEpisode}
                currentServer={currentServer}
                onEpisodeChange={handleEpisodeChange}
              />
            )}
            
            {/* Movie Info on mobile */}
            <div className="mt-6 lg:hidden">
              <MovieInfo movie={movie} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}