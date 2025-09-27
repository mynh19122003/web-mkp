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
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'new';
    const page = parseInt(searchParams.get('page') || '1');
    const keyword = searchParams.get('keyword') || '';
    const categorySlug = searchParams.get('categorySlug') || '';
    const rating = searchParams.get('rating') || '';
    const voteCount = searchParams.get('voteCount') || '';

    let movies: Movie[] = [];

    // OPTIMIZED: Simplified logic với early returns
    if (rating || voteCount) {
      if (type && type !== 'new') {
        // Type-specific với filters
        movies = await getMoviesByType(type, page, keyword, categorySlug);
        movies = filterMoviesByRatingAndVoteCount(movies, rating, voteCount);
      } else {
        // Global filtering - REDUCED concurrent requests để giảm load
        const [trendingMovies, newMovies, animeMovies] = await Promise.all([
          PhimAPIService.getTrendingMovies(page),
          PhimAPIService.getNewMovies(page), 
          PhimAPIService.getHotAnime(page)
        ]);
        
        const combinedMovies = [...trendingMovies, ...newMovies, ...animeMovies]
        movies = combinedMovies
          .filter((movie, index, self) => index === self.findIndex(m => m.id === movie.id))
          .slice(0, 50) // Limit để optimize performance
          
        movies = filterMoviesByRatingAndVoteCount(movies, rating, voteCount);
      }
    } else {
      // Fast path: Simple type-based requests
      movies = await getMoviesByType(type, page, keyword, categorySlug);
    }

    const processingTime = Date.now() - startTime

    // Smart caching strategy
    const response = NextResponse.json({
      success: true,
      data: movies,
      page,
      type,
      total: movies.length,
      performance: {
        processingTime,
        optimized: true
      }
    });

    // Dynamic cache headers
    const cacheTime = type === 'new' ? 120 : 300 // New: 2min, Others: 5min
    response.headers.set('Cache-Control', `public, max-age=${cacheTime}, stale-while-revalidate=${cacheTime * 2}`)
    response.headers.set('X-Processing-Time', `${processingTime}ms`)

    return response

  } catch (error) {
    console.error('Movies API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Không thể tải danh sách phim',
        data: [],
        performance: {
          processingTime: Date.now() - startTime,
          error: true
        }
      },
      { status: 500 }
    );
  }
}