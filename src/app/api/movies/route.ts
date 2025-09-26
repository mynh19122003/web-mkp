import { NextRequest, NextResponse } from 'next/server';
import { PhimAPIService } from '@/services/kkphim';
import { Movie } from '@/types/movie';

// Helper function để filter phim theo rating và voteCount
function filterMoviesByRatingAndVoteCount(movies: Movie[], rating: string, voteCount: string): Movie[] {
  let filteredMovies = movies;

  // Bước 1: Loại bỏ phim có voteAverage = 0 và voteCount = 0 KHI CÓ filter
  if (rating || voteCount) {
    filteredMovies = filteredMovies.filter(movie => 
      (movie.voteAverage && movie.voteAverage > 0) || 
      (movie.voteCount && movie.voteCount > 0) ||
      (movie.imdbRating && movie.imdbRating > 0) ||
      (movie.rating && movie.rating > 0)
    );
  }

  // Bước 2: Áp dụng rating filter nếu có
  if (rating) {
    switch (rating) {
      case 'excellent': // >= 8.5
        filteredMovies = filteredMovies.filter(movie => 
          (movie.voteAverage && movie.voteAverage >= 8.5) ||
          (movie.imdbRating && movie.imdbRating >= 8.5) ||
          (movie.rating && movie.rating >= 8.5)
        );
        break;
      case 'high': // >= 8.0
        filteredMovies = filteredMovies.filter(movie => 
          (movie.voteAverage && movie.voteAverage >= 8.0) ||
          (movie.imdbRating && movie.imdbRating >= 8.0) ||
          (movie.rating && movie.rating >= 8.0)
        );
        break;
      case 'good': // >= 7.0
        filteredMovies = filteredMovies.filter(movie => 
          (movie.voteAverage && movie.voteAverage >= 7.0) ||
          (movie.imdbRating && movie.imdbRating >= 7.0) ||
          (movie.rating && movie.rating >= 7.0)
        );
        break;
      case 'moderate': // 6.0-7.9
        filteredMovies = filteredMovies.filter(movie => {
          const movieRating = movie.voteAverage || movie.imdbRating || movie.rating || 0;
          return movieRating >= 6.0 && movieRating < 8.0;
        });
        break;
    }
  }

  // Bước 3: Áp dụng voteCount filter nếu có
  if (voteCount) {
    switch (voteCount) {
      case 'viral': // >= 5000
        filteredMovies = filteredMovies.filter(movie => 
          movie.voteCount && movie.voteCount >= 5000
        );
        break;
      case 'popular': // >= 1000
        filteredMovies = filteredMovies.filter(movie => 
          movie.voteCount && movie.voteCount >= 1000
        );
        break;
      case 'trending': // >= 500
        filteredMovies = filteredMovies.filter(movie => 
          movie.voteCount && movie.voteCount >= 500
        );
        break;
      case 'niche': // 100-500
        filteredMovies = filteredMovies.filter(movie => 
          movie.voteCount && movie.voteCount >= 100 && movie.voteCount < 500
        );
        break;
      case 'fresh': // < 100
        filteredMovies = filteredMovies.filter(movie => 
          movie.voteCount && movie.voteCount < 100
        );
        break;
    }
  }

  return filteredMovies;
}

// Helper function để lấy phim theo type
async function getMoviesByType(type: string, page: number, keyword: string, categorySlug: string): Promise<Movie[]> {
  switch (type) {
    case 'new': return await PhimAPIService.getNewMovies(page);
    case 'movie': return await PhimAPIService.getMovies(page);
    case 'single': return await PhimAPIService.getSingleMovies(page);
    case 'series': return await PhimAPIService.getSeriesMovies(page);
    case 'tv': return await PhimAPIService.getTVSeries(page);
    case 'cinema': return await PhimAPIService.getCinemaMovies(page);
    case 'anime': return await PhimAPIService.getHotAnime(page);
    case 'korean': return await PhimAPIService.getMoviesByCountry('korean', page);
    case 'chinese': return await PhimAPIService.getMoviesByCountry('chinese', page);
    case 'western': return await PhimAPIService.getMoviesByCountry('western', page);
    case 'search': return keyword ? await PhimAPIService.searchMovies(keyword, page) : [];
    case 'category': return categorySlug ? await PhimAPIService.getMoviesByCategory(categorySlug, page) : [];
    default: return await PhimAPIService.getNewMovies(page);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'new';
    const page = parseInt(searchParams.get('page') || '1');
    const keyword = searchParams.get('keyword') || '';
    const categorySlug = searchParams.get('categorySlug') || '';
    const rating = searchParams.get('rating') || '';
    const voteCount = searchParams.get('voteCount') || '';

    let movies: Movie[] = [];

    // Logic: Parameters có thể standalone hoặc kết hợp theo thứ tự
    if (rating || voteCount) {
      if (type && type !== 'new') {
        // Có type + filter → Lấy theo type trước
        movies = await getMoviesByType(type, page, keyword, categorySlug);
      } else {
        // Chỉ có filter → Lấy từ tất cả nguồn
        const [newMovies, singleMovies, seriesMovies, cinemaMovies, koreanMovies, chineseMovies, westernMovies, animeMovies] = await Promise.all([
          PhimAPIService.getNewMovies(page),
          PhimAPIService.getSingleMovies(page),
          PhimAPIService.getSeriesMovies(page), 
          PhimAPIService.getCinemaMovies(page),
          PhimAPIService.getMoviesByCountry('korean', page),
          PhimAPIService.getMoviesByCountry('chinese', page),
          PhimAPIService.getMoviesByCountry('western', page),
          PhimAPIService.getHotAnime(page)
        ]);
        
        const allMovies = [...newMovies, ...singleMovies, ...seriesMovies, ...cinemaMovies, ...koreanMovies, ...chineseMovies, ...westernMovies, ...animeMovies];
        movies = allMovies.filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id || m.slug === movie.slug)
        );
      }
      // Áp dụng filter
      movies = filterMoviesByRatingAndVoteCount(movies, rating, voteCount);
    } else {
      // Chỉ có type hoặc không có gì
      movies = await getMoviesByType(type, page, keyword, categorySlug);
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