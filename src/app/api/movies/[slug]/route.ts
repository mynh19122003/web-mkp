import { NextRequest, NextResponse } from 'next/server';
import { PhimAPIService } from '@/services/kkphim';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const movie = await PhimAPIService.getMovieDetail(params.slug);

    if (!movie) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Không tìm thấy phim',
          data: null 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: movie
    });

  } catch (error) {
    console.error('Lỗi API chi tiết phim:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Không thể tải thông tin phim',
        data: null 
      },
      { status: 500 }
    );
  }
}