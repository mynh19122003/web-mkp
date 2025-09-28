import { NextRequest, NextResponse } from 'next/server'
import { PhimAPIService } from '@/services/kkphim'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')

    if (!query || query.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Search query is required'
      }, { status: 400 })
    }

    console.log(`🔍 Searching for: "${query}" (page ${page})`)
    
    const movies = await PhimAPIService.searchMovies(query.trim(), page)
    
    return NextResponse.json({
      success: true,
      data: movies,
      query: query.trim(),
      page: page,
      total: movies.length
    })
    
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}