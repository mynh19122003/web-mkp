import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/memoryDb'
import { PhimAPIService } from '@/services/kkphim'

const REAL_USER_EMAIL = 'user@rophim.com'

// API tạm thời để test watchlist không cần auth
export async function GET(request: NextRequest) {
  try {
    console.log(`🔑 Testing watchlist for user: ${REAL_USER_EMAIL}`)
    
    // Lấy user từ database
    const client = await getMongoClient()
    const db = client.db('watchlistdb')
    const user = await db.collection('users').findOne({ email: REAL_USER_EMAIL })
    
    if (!user || !user.watchlist) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        userEmail: REAL_USER_EMAIL,
        message: 'No watchlist found'
      })
    }

    const movieIds = user.watchlist
    console.log(`📽️ Found ${movieIds.length} movies in watchlist`)
    
    // Lấy thông tin chi tiết từ PhimAPI bằng movie IDs
    const moviePromises = movieIds.map(async (movieId: string, index: number) => {
      try {
        console.log(`🎬 [${index + 1}/${movieIds.length}] Fetching movie ID: ${movieId}`)
        
        const movie = await PhimAPIService.getMovieById(movieId)
        
        if (movie) {
          console.log(`✅ [${index + 1}/${movieIds.length}] Success: ${movie.title}`)
          return {
            ...movie,
            addedToWatchlistAt: user.createdAt || new Date().toISOString(),
            watchlistId: movieId,
            isInWatchlist: true
          }
        } else {
          console.log(`⚠️ [${index + 1}/${movieIds.length}] No data for movie ID: ${movieId}`)
          return null
        }
      } catch (error) {
        console.error(`❌ [${index + 1}/${movieIds.length}] Error fetching movie ID ${movieId}:`, error)
        return null
      }
    })

    const results = await Promise.all(moviePromises)
    const validMovies = results.filter(movie => movie !== null)
    
    console.log(`🎯 Successfully fetched ${validMovies.length}/${movieIds.length} movies`)

    return NextResponse.json({
      success: true,
      data: validMovies,
      total: validMovies.length,
      userEmail: REAL_USER_EMAIL,
      requested: movieIds.length,
      stats: {
        total: validMovies.length,
        movies: validMovies.filter(m => m.type === 'single').length,
        series: validMovies.filter(m => m.type === 'series').length,
        avgRating: validMovies.length > 0 ? 
          validMovies.reduce((acc, m) => acc + (m.imdbRating || m.rating || 0), 0) / validMovies.length : 0
      }
    })
  } catch (error) {
    console.error('Get test watchlist error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}