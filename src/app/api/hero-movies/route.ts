import { NextRequest, NextResponse } from 'next/server'
import { PhimAPIService } from '@/services/kkphim'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' || 'cinema'
    const page = parseInt(searchParams.get('page') || '1')

    // Lấy phim với content đầy đủ cho hero section (mặc định cinema)
    const movies = await PhimAPIService.getMoviesWithFullContent(type, page)

    return NextResponse.json({
      success: true,
      data: movies,
      total: movies.length
    })
  } catch (error) {
    console.error('Lỗi API hero-movies:', error)
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