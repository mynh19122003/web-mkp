import { NextRequest, NextResponse } from 'next/server'
import { PhimAPIService } from '@/services/kkphim'

// API để lấy thông tin chi tiết phim theo ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('id')
    
    if (!movieId) {
      return NextResponse.json({
        success: false,
        error: 'Movie ID is required'
      }, { status: 400 })
    }

    // Lấy thông tin phim từ PhimAPI
    const movie = await PhimAPIService.getMovieDetail(movieId)
    
    if (!movie) {
      return NextResponse.json({
        success: false,
        error: 'Movie not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: movie
    })
  } catch (error) {
    console.error('Get movie details error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// API để lấy nhiều phim cùng lúc
export async function POST(request: NextRequest) {
  try {
    const { movieIds } = await request.json()
    
    if (!movieIds || !Array.isArray(movieIds)) {
      return NextResponse.json({
        success: false,
        error: 'Movie IDs array is required'
      }, { status: 400 })
    }

    if (movieIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Lấy thông tin tất cả phim song song
    const moviePromises = movieIds.map(async (movieId) => {
      try {
        const movie = await PhimAPIService.getMovieDetail(movieId)
        return movie
      } catch (error) {
        console.error(`Error fetching movie ${movieId}:`, error)
        return null
      }
    })

    const results = await Promise.all(moviePromises)
    const validMovies = results.filter(movie => movie !== null)

    return NextResponse.json({
      success: true,
      data: validMovies,
      total: validMovies.length,
      requested: movieIds.length
    })
  } catch (error) {
    console.error('Get multiple movies error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}