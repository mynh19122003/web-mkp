'use client'

import { useEffect, useState } from 'react'
import { Heart, Clock, TrendingUp } from 'lucide-react'

interface WatchlistStatsProps {
  totalMovies: number
  refreshTrigger?: number
}

interface Stats {
  totalMovies: number
  addedToday: number
  mostWatchedGenre: string
}

export default function WatchlistStats({ totalMovies, refreshTrigger = 0 }: WatchlistStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalMovies,
    addedToday: 0,
    mostWatchedGenre: 'Hành động'
  })

  useEffect(() => {
    // Simulate stats calculation
    setStats({
      totalMovies,
      addedToday: Math.floor(Math.random() * 3) + 1,
      mostWatchedGenre: ['Hành động', 'Kinh dị', 'Tình cảm', 'Hài hước'][Math.floor(Math.random() * 4)]
    })
  }, [totalMovies, refreshTrigger])

  if (totalMovies === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-red-500/10 to-red-600/20 p-6 rounded-xl border border-red-500/20">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalMovies}</p>
            <p className="text-red-300 text-sm">Phim đã lưu</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 p-6 rounded-xl border border-blue-500/20">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-white">{stats.addedToday}</p>
            <p className="text-blue-300 text-sm">Thêm hôm nay</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 p-6 rounded-xl border border-green-500/20">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-lg font-bold text-white">{stats.mostWatchedGenre}</p>
            <p className="text-green-300 text-sm">Thể loại yêu thích</p>
          </div>
        </div>
      </div>
    </div>
  )
}