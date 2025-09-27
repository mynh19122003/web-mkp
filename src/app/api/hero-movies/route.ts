import { NextRequest, NextResponse } from 'next/server'
import { PhimAPIService } from '@/services/kkphim'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' || 'cinema'

    // OPTIMIZED: Single API call, no detail fetching
    const movies = await PhimAPIService.getOptimizedHeroMovies(type)

    // Set aggressive caching headers
    const response = NextResponse.json({
      success: true,
      data: movies,
      total: movies.length,
      optimized: true
    })

    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Hero movies API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Không thể tải dữ liệu phim',
        data: []
      },
      { status: 500 }
    )
  }
}