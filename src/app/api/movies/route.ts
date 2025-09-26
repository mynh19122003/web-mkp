import { NextRequest, NextResponse } from 'next/server';
import { PhimAPIService } from '@/services/kkphim';
import { Movie } from '@/types/movie';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'new'; // new, movie, tv, search
    const page = parseInt(searchParams.get('page') || '1');
    const keyword = searchParams.get('keyword') || '';

    let movies: Movie[] = [];

    switch (type) {
      case 'new':
        movies = await PhimAPIService.getNewMovies(page);
        break;
      case 'movie':
        movies = await PhimAPIService.getMovies(page);
        break;
      case 'tv':
        movies = await PhimAPIService.getTVSeries(page);
        break;
      case 'cinema':
        movies = await PhimAPIService.getCinemaMovies(page);
        break;
      case 'anime':
        movies = await PhimAPIService.getHotAnime(page);
        break;
      case 'korean':
        movies = await PhimAPIService.getMoviesByCountry('korean', page);
        break;
      case 'chinese':
        movies = await PhimAPIService.getMoviesByCountry('chinese', page);
        break;
      case 'western':
        movies = await PhimAPIService.getMoviesByCountry('western', page);
        break;
      case 'search':
        if (keyword) {
          movies = await PhimAPIService.searchMovies(keyword, page);
        }
        break;
      default:
        movies = await PhimAPIService.getNewMovies(page);
    }

    return NextResponse.json({
      success: true,
      data: movies,
      page,
      type,
      total: movies.length
    });

  } catch (error) {
    console.error('Lỗi API movies:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Không thể tải danh sách phim',
        data: [] 
      },
      { status: 500 }
    );
  }
}