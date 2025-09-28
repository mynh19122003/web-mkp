'use client'

import { useState } from 'react'
import { Play, ChevronDown, ChevronUp } from 'lucide-react'

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

interface EpisodeListProps {
  servers: ServerGroup[]
  currentEpisode: Episode | null
  currentServer: number
  onEpisodeChange: (episode: Episode, serverIndex: number) => void
}

export default function EpisodeList({ 
  servers, 
  currentEpisode, 
  currentServer, 
  onEpisodeChange 
}: EpisodeListProps) {
  const [expandedServers, setExpandedServers] = useState<number[]>([0])

  const toggleServerExpansion = (serverIndex: number) => {
    setExpandedServers(prev => 
      prev.includes(serverIndex) 
        ? prev.filter(i => i !== serverIndex)
        : [...prev, serverIndex]
    )
  }

  if (servers.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <p className="text-gray-400 text-center">Không có tập phim</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Danh sách tập</h3>
      
      {servers.map((server, serverIndex) => (
        <div key={serverIndex} className="bg-gray-900 rounded-lg overflow-hidden">
          {/* Server Header */}
          <button
            onClick={() => toggleServerExpansion(serverIndex)}
            className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
              currentServer === serverIndex 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div>
              <span className="font-semibold">{server.serverName}</span>
              <span className="text-sm ml-2 opacity-75">
                ({server.episodes.length} tập)
              </span>
            </div>
            {expandedServers.includes(serverIndex) ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {/* Episodes List */}
          {expandedServers.includes(serverIndex) && (
            <div className="max-h-96 overflow-y-auto">
              {server.episodes.map((episode, episodeIndex) => (
                <button
                  key={episode.id}
                  onClick={() => onEpisodeChange(episode, serverIndex)}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left border-t border-gray-700 transition-colors ${
                    currentEpisode?.id === episode.id && currentServer === serverIndex
                      ? 'bg-red-600/20 text-white border-red-600/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentEpisode?.id === episode.id && currentServer === serverIndex
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {episode.episodeNumber}
                    </div>
                    <div>
                      <div className="font-medium">{episode.title}</div>
                      {episode.duration > 0 && (
                        <div className="text-xs text-gray-500">
                          {Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentEpisode?.id === episode.id && currentServer === serverIndex && (
                    <Play className="w-4 h-4 text-red-600 fill-current" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Episode Navigation */}
      {currentEpisode && servers[currentServer] && (
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => {
              const episodes = servers[currentServer].episodes
              const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id)
              if (currentIndex > 0) {
                onEpisodeChange(episodes[currentIndex - 1], currentServer)
              }
            }}
            disabled={!currentEpisode || servers[currentServer]?.episodes.findIndex(ep => ep.id === currentEpisode.id) === 0}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Tập trước
          </button>
          
          <span className="text-gray-400 text-sm">
            Tập {currentEpisode.episodeNumber} / {servers[currentServer]?.episodes.length}
          </span>
          
          <button
            onClick={() => {
              const episodes = servers[currentServer].episodes
              const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id)
              if (currentIndex < episodes.length - 1) {
                onEpisodeChange(episodes[currentIndex + 1], currentServer)
              }
            }}
            disabled={!currentEpisode || servers[currentServer]?.episodes.findIndex(ep => ep.id === currentEpisode.id) === servers[currentServer]?.episodes.length - 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Tập sau →
          </button>
        </div>
      )}
    </div>
  )
}