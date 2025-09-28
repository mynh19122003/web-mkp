// Service để tích hợp API PhimAPI.com
import { Movie } from '@/types/movie'

const API_BASE_URL = 'https://phimapi.com'

// Advanced cache system với multiple strategies
const cache = new Map<string, { data: any, timestamp: number }>()
const requestCache = new Map<string, Promise<any>>() // Prevent duplicate concurrent requests
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes - longer cache
const FAST_CACHE_DURATION = 2 * 60 * 1000 // 2 minutes for frequent requests

export class PhimAPIService {
  // SMART PRELOAD: Critical endpoints only
  static async preloadCache(): Promise<void> {
    const criticalEndpoints = [
      `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`, // New movies (most requested)
      `${API_BASE_URL}/v1/api/the-loai/hoat-hinh?page=1`     // Anime (popular section)
    ]

    // Staggered preloading để không overwhelm API
    criticalEndpoints.forEach((url, index) => {
      setTimeout(() => {
        this.cachedFetch(url, true).catch(() => {
          // Silent fail - preload không nên block main functionality
        })
      }, index * 300) // 300ms stagger
    })
  }

  // Optimized fetch với request deduplication và adaptive caching
  private static async cachedFetch(url: string, fastCache = false): Promise<any> {
    const cacheKey = url
    const cacheDuration = fastCache ? FAST_CACHE_DURATION : CACHE_DURATION
    
    // Check cache first
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data
    }
    
    // Check if request is already in flight
    if (requestCache.has(cacheKey)) {
      return await requestCache.get(cacheKey)!
    }
    
    // Create new request
    const requestPromise = this.performFetch(url)
    requestCache.set(cacheKey, requestPromise)
    
    try {
      const data = await requestPromise
      // Cache successful results
      cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } finally {
      // Remove from request cache
      requestCache.delete(cacheKey)
    }
  }
  
  private static async performFetch(url: string): Promise<any> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Fetch failed for: ${url}`, error)
      return { status: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Lấy danh sách phim mới nhất - OPTIMIZED
  static async getNewMovies(page: number = 1): Promise<Movie[]> {
    try {
      const data = await this.cachedFetch(`${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`, true)
      return this.transformMovieData(data.items || [])
    } catch (error) {
      console.error('New movies error:', error)
      return []
    }
  }

  // Lấy danh sách phim bộ - OPTIMIZED
  static async getTVSeries(page: number = 1): Promise<Movie[]> {
    try {
      const data = await this.cachedFetch(`${API_BASE_URL}/v1/api/danh-sach/phim-bo?page=${page}`, true)
      return this.transformMovieData(data.data?.items || [])
    } catch (error) {
      console.error('TV Series error:', error)
      return []
    }
  }

  // Lấy danh sách phim lẻ - OPTIMIZED  
  static async getMovies(page: number = 1): Promise<Movie[]> {
    try {
      const data = await this.cachedFetch(`${API_BASE_URL}/v1/api/danh-sach/phim-le?page=${page}`, true)
      return this.transformMovieData(data.data?.items || [])
    } catch (error) {
      console.error('Movies error:', error)
      return []
    }
  }

  // Lấy danh sách phim lẻ (single)
  static async getSingleMovies(page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-le?page=${page}`)
      const data = await response.json()
      
      const movies = this.transformMovieData(data.data?.items || [])
      
      // Filter cực kỳ chặt chẽ - chỉ lấy phim lẻ thực sự
      const filteredMovies = movies.filter(movie => {
        // 1. Kiểm tra type phải là single
        const isSingleType = movie.type === 'single' || movie.apiType === 'single'
        
        // 2. Kiểm tra số tập phải là 1
        const totalEpisodes = movie.totalEpisodes || 0
        const isSingleEpisode = totalEpisodes <= 1
        
        // 3. Kiểm tra currentEpisode phải <= 1
        const currentEpisode = movie.currentEpisode || 1
        const hasOnlyOneEpisode = currentEpisode <= 1
        
        // 4. Kiểm tra title và description không có dấu hiệu phim bộ
        const title = movie.title.toLowerCase()
        const description = movie.description.toLowerCase()
        const hasNoSeriesIndicators = !title.includes('tập') && 
                                     !title.includes('phần') &&
                                     !title.includes('season') &&
                                     !description.includes('tập') &&
                                     !description.includes('phần') &&
                                     !description.includes('season') &&
                                     !description.includes('episodes') &&
                                     !description.includes('phim bộ')
        
        // 5. Kiểm tra duration - phim lẻ thường > 60 phút
        const hasMovieDuration = movie.duration >= 60
        
        // Log để debug
        if (!isSingleType || !isSingleEpisode || !hasOnlyOneEpisode || !hasNoSeriesIndicators) {
          console.log(`Filtered out: ${movie.title} - Type: ${movie.type}, Episodes: ${totalEpisodes}, Current: ${currentEpisode}`)
        }
        
        return isSingleType && isSingleEpisode && hasOnlyOneEpisode && hasNoSeriesIndicators && hasMovieDuration
      })
      
      return filteredMovies
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim lẻ:', error)
      return []
    }
  }

  // Lấy danh sách phim bộ (series)
  static async getSeriesMovies(page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-bo?page=${page}`)
      const data = await response.json()
      
      const movies = this.transformMovieData(data.data?.items || [])
      // Filter chỉ lấy phim có type là 'series'
      return movies.filter(movie => movie.apiType === 'series' || movie.type === 'series')
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim bộ:', error)
      return []
    }
  }

  // Lấy chi tiết phim theo slug
  static async getMovieDetail(slug: string): Promise<Movie | null> {
    try {
      console.log(`🔍 Fetching movie detail for slug: ${slug}`)
      const response = await fetch(`${API_BASE_URL}/phim/${slug}`)
      
      if (!response.ok) {
        console.log(`❌ API response not ok: ${response.status} ${response.statusText}`)
        return null
      }
      
      const data = await response.json()
      console.log(`🔍 API response status: ${data.status}, has movie: ${!!data.movie}`)
      
      if (data.status && data.movie) {
        const transformedMovie = this.transformSingleMovieDetail(data.movie)
        console.log(`✅ Successfully transformed movie: ${transformedMovie?.title}`)
        return transformedMovie
      }
      
      console.log(`⚠️ No valid movie data in response for: ${slug}`)
      return null
    } catch (error) {
      console.error(`❌ Error fetching movie detail for ${slug}:`, error)
      return null
    }
  }

  // Lấy chi tiết phim theo ID (tìm kiếm trong danh sách)
  static async getMovieById(movieId: string): Promise<Movie | null> {
    try {
      console.log(`🔍 Searching for movie with ID: ${movieId}`)
      
      // Thử tìm theo slug trước (nếu movieId là slug)
      const movieBySlug = await this.getMovieDetail(movieId)
      if (movieBySlug) {
        return movieBySlug
      }
      
      // Nếu không phải slug, tìm trong danh sách phim mới
      const endpoints = [
        `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`,
        `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=2`,
        `${API_BASE_URL}/v1/api/danh-sach/phim-bo?page=1`,
        `${API_BASE_URL}/v1/api/danh-sach/phim-le?page=1`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          const data = await response.json()
          
          let movies: any[] = []
          if (data.items) movies = data.items
          else if (data.data?.items) movies = data.data.items
          
          // Tìm phim theo ID hoặc _id
          const foundMovie = movies.find(movie => 
            movie._id === movieId || 
            movie.id === movieId ||
            movie.slug === movieId
          )
          
          if (foundMovie) {
            console.log(`✅ Found movie by ID: ${foundMovie.name}`)
            const transformedMovies = this.transformMovieData([foundMovie])
            return transformedMovies[0] || null
          }
        } catch (err) {
          console.log(`Search endpoint ${endpoint} failed:`, err)
        }
      }
      
      console.log(`⚠️ Movie not found with ID: ${movieId}`)
      return null
    } catch (error) {
      console.error(`❌ Error searching for movie ID ${movieId}:`, error)
      return null
    }
  }

  // Helper method để lấy phim theo type
  private static async getMoviesByType(type: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western', page: number = 1): Promise<Movie[]> {
    switch (type) {
      case 'new':
        return this.getNewMovies(page)
      case 'movie':
        return this.getMovies(page)
      case 'tv':
        return this.getTVSeries(page)
      case 'cinema':
        return this.getCinemaMovies(page)
      case 'anime':
        return this.getHotAnime(page)
      case 'korean':
        return this.getMoviesByCountry('korean', page)
      case 'chinese':
        return this.getMoviesByCountry('chinese', page)
      case 'western':
        return this.getMoviesByCountry('western', page)
      default:
        return this.getNewMovies(page)
    }
  }

  // OPTIMIZED: Hero movies với single API call (không fetch detail)
  static async getOptimizedHeroMovies(type: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' = 'cinema'): Promise<Movie[]> {
    try {
      // Single optimized call với aggressive caching
      let movies: Movie[] = []
      
      switch (type) {
        case 'cinema':
          // Lấy trending movies thay vì cinema (có rating tốt hơn)
          movies = await this.getTrendingMovies(1)
          break
        case 'anime':
          movies = await this.getHotAnime(1)
          break
        default:
          movies = await this.getMoviesByType(type, 1)
      }
      
      // Chọn 5 phim tốt nhất cho hero với existing data
      return movies
        .filter(movie => {
          const rating = movie.voteAverage || movie.imdbRating || movie.rating || 0
          return rating >= 7.0 && movie.description && movie.description.length > 50
        })
        .sort((a, b) => {
          const scoreA = (a.voteAverage || a.imdbRating || a.rating || 0) + (a.voteCount ? Math.log10(a.voteCount) : 0)
          const scoreB = (b.voteAverage || b.imdbRating || b.rating || 0) + (b.voteCount ? Math.log10(b.voteCount) : 0)
          return scoreB - scoreA
        })
        .slice(0, 5)
        
    } catch (error) {
      console.error('Hero movies optimization error:', error)
      return []
    }
  }

  // DEPRECATED: Legacy method for backward compatibility
  static async getMoviesWithFullContent(type: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' = 'new', page: number = 1): Promise<Movie[]> {
    // Redirect to optimized method
    return this.getOptimizedHeroMovies(type)
  }

  // 1. Trending movies - PERFORMANCE OPTIMIZED với TMDB data
  static async getTrendingMovies(page: number = 1): Promise<Movie[]> {
    try {
      // Single optimized call với fast cache
      const data = await this.cachedFetch(`${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`, true)
      
      if (data.items) {
        const movies = this.transformMovieData(data.items)
        
        // Sử dụng TMDB vote_average và vote_count từ API response
        return movies
          .filter(movie => {
            const rating = movie.voteAverage || movie.rating || 0
            const voteCount = movie.voteCount || 0
            // Chỉ lấy phim có rating tốt và đủ votes
            return rating >= 7.0 && voteCount >= 50
          })
          .sort((a, b) => {
            // TMDB weighted score: vote_average * log(vote_count)
            const scoreA = (a.voteAverage || a.rating || 0) * Math.log10((a.voteCount || 1) + 1)
            const scoreB = (b.voteAverage || b.rating || 0) * Math.log10((b.voteCount || 1) + 1)
            return scoreB - scoreA
          })
          .slice(0, 20)
      }

      return this.getNewMovies(page)
    } catch (error) {
      console.error('Trending movies error:', error)
      return this.getNewMovies(page)
    }
  }

  // 2. Phim hoàn thành trong 1 tháng vừa qua
  static async getRecentlyCompleted(page: number = 1): Promise<Movie[]> {
    try {
      // Lấy phim từ endpoint hoàn thành
      let completedMovies: Movie[] = []
      
      try {
        const response = await fetch(`${API_BASE_URL}/danh-sach/phim-hoan-thanh?page=${page}`)
        const data = await response.json()
        if (data.items) {
          completedMovies = this.transformMovieData(data.items)
        }
      } catch (err) {
        console.log('Completed endpoint failed, using new movies:', err)
      }

      // Nếu không có phim hoàn thành, lấy phim mới và filter
      if (completedMovies.length === 0) {
        const [newMovies, tvSeries] = await Promise.all([
          this.getNewMovies(page),
          this.getTVSeries(page)
        ])
        
        completedMovies = [...newMovies, ...tvSeries]
          .filter(movie => 
            movie.isCompleted ||
            (movie.currentEpisode && movie.totalEpisodes && movie.currentEpisode >= movie.totalEpisodes) ||
            movie.title.includes('Full') ||
            movie.title.includes('Hoàn thành') ||
            movie.description?.includes('Hoàn thành')
          )
      }
      
      // Sắp xếp theo điểm số và ngày cập nhật
      return completedMovies
        .filter(movie => (movie.imdbRating || movie.rating || 0) > 6.0)
        .sort((a, b) => {
          const scoreA = (a.imdbRating || a.rating || 7.0) * 100 + (a.views || Math.random() * 500)
          const scoreB = (b.imdbRating || b.rating || 7.0) * 100 + (b.views || Math.random() * 500)
          return scoreB - scoreA
        })
        .slice(0, 20)
    } catch (error) {
      console.error('Lỗi khi lấy phim hoàn thành:', error)
      return this.getNewMovies(page)
    }
  }

  // 3. Phim hot 24h cho banner - phim mới nhất và nổi tiếng nhất trong 24h
  static async getHot24hMovies(): Promise<Movie[]> {
    try {
      // Lấy phim mới nhất (trong 24h)
      const newMovies = await this.getNewMovies(1)
      
      if (newMovies.length === 0) {
        console.log('No new movies found for hot 24h')
        return []
      }
      
      // Lọc và sắp xếp phim hot 24h
      const hot24hMovies = newMovies
        .filter(movie => (movie.imdbRating || movie.rating || 0) > 6.5)
        .sort((a, b) => {
          // Ưu tiên phim có điểm cao và views cao
          const scoreA = (a.views || Math.random() * 2000) * 0.6 + (a.imdbRating || a.rating || 7.5) * 200
          const scoreB = (b.views || Math.random() * 2000) * 0.6 + (b.imdbRating || b.rating || 7.5) * 200
          return scoreB - scoreA
        })
        .slice(0, 6) // Lấy 6 phim cho banner carousel

      return hot24hMovies.length > 0 ? hot24hMovies : newMovies.slice(0, 6)
    } catch (error) {
      console.error('Lỗi khi lấy phim hot 24h:', error)
      return this.getNewMovies(1).then(movies => movies.slice(0, 6))
    }
  }

  // 4. Phim nổi tiếng trong tháng - phim lẻ và phim bộ hot
  static async getPopularMovies(type: 'movie' | 'tv', page: number = 1): Promise<Movie[]> {
    try {
      let movies: Movie[] = []
      
      if (type === 'movie') {
        // Lấy phim lẻ nổi tiếng
        try {
          const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-le?page=${page}`)
          const data = await response.json()
          if (data.data?.items) {
            movies = this.transformMovieData(data.data.items)
          }
        } catch (err) {
          console.log('Movie endpoint failed, using fallback')
          movies = await this.getMovies(page)
        }
      } else {
        // Lấy phim bộ nổi tiếng
        try {
          const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-bo?page=${page}`)
          const data = await response.json()
          if (data.data?.items) {
            movies = this.transformMovieData(data.data.items)
          }
        } catch (err) {
          console.log('TV series endpoint failed, using fallback')
          movies = await this.getTVSeries(page)
        }
      }

      // Nếu không có dữ liệu, fallback
      if (movies.length === 0) {
        movies = type === 'movie' ? await this.getMovies(page) : await this.getTVSeries(page)
      }
      
      // Sắp xếp theo độ nổi tiếng trong tháng
      return movies
        .filter(movie => (movie.imdbRating || movie.rating || 0) > 6.0)
        .sort((a, b) => {
          const scoreA = (a.views || Math.random() * 1500) * 0.7 + (a.imdbRating || a.rating || 7.0) * 150
          const scoreB = (b.views || Math.random() * 1500) * 0.7 + (b.imdbRating || b.rating || 7.0) * 150
          return scoreB - scoreA
        })
        .slice(0, 20)
    } catch (error) {
      console.error(`Lỗi khi lấy phim ${type} nổi tiếng:`, error)
      return type === 'movie' ? this.getMovies(page) : this.getTVSeries(page)
    }
  }

  // 5. Anime hot - OPTIMIZED với fallback
  static async getHotAnime(page: number = 1): Promise<Movie[]> {
    try {
      // Primary: API hoạt hình
      const data = await this.cachedFetch(`${API_BASE_URL}/v1/api/the-loai/hoat-hinh?page=${page}`, true)
      
      if (data.status && data.data?.items?.length > 0) {
        const movies = this.transformMovieData(data.data.items)
        
        // Relaxed filtering cho nhiều anime content
        const filteredMovies = movies.filter(movie => {
          const rating = movie.voteAverage || movie.rating || 6.0
          return rating >= 5.0 // Balanced quality threshold
        })
        
        if (filteredMovies.length > 0) {
          return filteredMovies
            .sort((a, b) => {
              const scoreA = (a.voteAverage || a.rating || 6.0) + (a.voteCount ? Math.log10(a.voteCount) : 0)
              const scoreB = (b.voteAverage || b.rating || 6.0) + (b.voteCount ? Math.log10(b.voteCount) : 0)
              return scoreB - scoreA
            })
            .slice(0, 24)
        }
      }
      
      // Fallback: Japan country với anime filtering
      try {
        const japanData = await this.cachedFetch(`${API_BASE_URL}/v1/api/quoc-gia/nhat-ban?page=${page}`, true)
        
        if (japanData.status && japanData.data?.items) {
          const movies = this.transformMovieData(japanData.data.items)
          const animeMovies = movies.filter(movie => this.hasApiAnimeType(movie))
          
          return animeMovies.slice(0, 20)
        }
      } catch (err) {
        // Silent fallback failure
      }
      
      return []
    } catch (error) {
      console.error('Anime fetch error:', error)
      return []
    }
  }

  // 6. Phim chiếu rạp - Bom tấn mới nhất
  static async getCinemaMovies(page: number = 1): Promise<Movie[]> {
    try {
      // Ưu tiên endpoint phim chiếu rạp chuyên biệt từ API
      try {
        const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-chieu-rap?page=${page}`)
        const data = await response.json()
        
        if (data.status && data.data?.items && data.data.items.length > 0) {
          return this.transformMovieData(data.data.items)
            .sort((a, b) => {
              // Sắp xếp theo rating và năm phát hành
              const ratingA = a.imdbRating || a.rating || 7.0
              const ratingB = b.imdbRating || b.rating || 7.0
              const scoreA = ratingA * 100 + (a.year - 2020) * 10 + (a.views || Math.random() * 1000) * 0.2
              const scoreB = ratingB * 100 + (b.year - 2020) * 10 + (b.views || Math.random() * 1000) * 0.2
              return scoreB - scoreA
            })
        }
      } catch (err) {
        console.log('Cinema API endpoint failed, using fallback')
      }

      // Fallback: Lấy phim từ nhiều nguồn và filter như phim chiếu rạp
      const [newMovies, movieList, tvSeries] = await Promise.all([
        this.getNewMovies(page),
        this.getMovies(page),
        this.getTVSeries(page)
      ])
      
      // Combine tất cả phim từ các nguồn
      const allMovies = [...newMovies, ...movieList, ...tvSeries]
      
      return allMovies
        .filter(movie => 
          // Loại bỏ phim quality kém và ưu tiên phim có rating cao
          movie.quality !== 'CAM' &&
          movie.quality !== 'TS' &&
          movie.year >= 2020 // Ưu tiên phim mới từ 2020 trở lại đây
        )
        .sort((a, b) => {
          // Ưu tiên phim có rating cao, nhưng cũng có phim rating thấp/không có rating
          const ratingA = a.imdbRating || a.rating || 6.0 // Default 6.0 cho phim không có rating
          const ratingB = b.imdbRating || b.rating || 6.0
          const scoreA = (a.views || Math.random() * 1500) * 0.3 + ratingA * 100 + (a.year - 2020) * 10
          const scoreB = (b.views || Math.random() * 1500) * 0.3 + ratingB * 100 + (b.year - 2020) * 10
          return scoreB - scoreA
        })
        .slice(0, 20)
    } catch (error) {
      console.error('Lỗi khi lấy phim chiếu rạp:', error)
      return this.getNewMovies(page)
    }
  }

  // 7. Phim theo quốc gia (sử dụng API country slug)
  static async getMoviesByCountry(country: 'korean' | 'chinese' | 'western' | 'japanese', page: number = 1): Promise<Movie[]> {
    try {
      let countrySlug = ''
      
      switch (country) {
        case 'korean':
          countrySlug = 'han-quoc'
          break
        case 'chinese':  
          countrySlug = 'trung-quoc'
          break
        case 'western':
          countrySlug = 'au-my'  // Sử dụng slug từ API
          break
        case 'japanese':
          countrySlug = 'nhat-ban'  // Nhật Bản cho anime
          break
      }

      // Sử dụng API endpoint country để lấy phim chính xác
      const response = await fetch(`${API_BASE_URL}/v1/api/quoc-gia/${countrySlug}?page=${page}`)
      const data = await response.json()
      
      if (data.status && data.data?.items?.length > 0) {
        return this.transformMovieData(data.data.items)
      }

      // Fallback: Nếu API country không có data, trả về array rỗng
      console.log(`No movies found for country ${country} with slug ${countrySlug}`)
      return []
      
    } catch (error) {
      console.error(`Lỗi khi lấy phim ${country}:`, error)
      return []
    }
  }

  // Lấy phim theo category
  static async getMoviesByCategory(categorySlug: string, page: number = 1): Promise<Movie[]> {
    try {
      // Thử với endpoint category từ PhimAPI
      const response = await fetch(`${API_BASE_URL}/v1/api/the-loai/${categorySlug}?page=${page}`)
      const data = await response.json()
      
      if (data.status && data.data?.items) {
        return this.transformMovieData(data.data.items)
      }

      // Fallback: tìm kiếm theo tên category
      const searchResponse = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(categorySlug)}&page=${page}`)
      const searchData = await searchResponse.json()
      
      if (searchData.status && searchData.data?.items) {
        return this.transformMovieData(searchData.data.items)
      }

      // Fallback cuối: lọc từ phim mới theo category trong genres
      const allMovies = await this.getNewMovies(1)
      return allMovies.filter(movie => 
        movie.genres?.some(genre => 
          genre.toLowerCase().includes(categorySlug.toLowerCase()) ||
          categorySlug.toLowerCase().includes(genre.toLowerCase())
        ) ||
        movie.categories?.some(cat => 
          cat.slug === categorySlug ||
          cat.name.toLowerCase().includes(categorySlug.toLowerCase())
        )
      ).slice(0, 20)
      
    } catch (error) {
      console.error(`Lỗi khi lấy phim theo category ${categorySlug}:`, error)
      return this.getNewMovies(page)
    }
  }

  // Tìm kiếm phim
  static async searchMovies(keyword: string, page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`)
      const data = await response.json()
      
      return this.transformMovieData(data.data?.items || [])
    } catch (error) {
      console.error('Lỗi khi tìm kiếm phim:', error)
      return []
    }
  }

  // OPTIMIZED: Smart image URL conversion với WebP + size optimization
  static convertImageUrl(originalUrl: string, size: 'thumb' | 'poster' = 'poster'): string {
    if (!originalUrl || originalUrl === 'null' || originalUrl === 'undefined') {
      const defaultUrl = 'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg'
      return this.convertToWebP(defaultUrl)
    }
    
    try {
      let cleanUrl = originalUrl.trim()
      
      // Skip conversion nếu đã là WebP converted URL
      if (cleanUrl.includes('phimapi.com/image.php')) {
        return cleanUrl
      }
      
      // Clean và normalize URL
      if (cleanUrl.includes('phimimg.com') || cleanUrl.includes('phimapi.com')) {
        cleanUrl = cleanUrl.replace('http://', 'https://').split('?')[0]
      } else if (cleanUrl.startsWith('/')) {
        cleanUrl = `https://phimimg.com${cleanUrl}`
      } else if (!cleanUrl.startsWith('http') && cleanUrl.includes('.')) {
        if (cleanUrl.includes('upload/vod/')) {
          cleanUrl = `https://phimimg.com/${cleanUrl}`
        } else {
          cleanUrl = `https://phimimg.com/upload/vod/${cleanUrl}`
        }
      } else {
        cleanUrl = 'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg'
      }
      
      // Convert to WebP với size optimization
      return this.convertToWebP(cleanUrl)
      
    } catch (error) {
      console.error('Image URL conversion error:', error)
      return this.convertToWebP('https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg')
    }
  }

  // Enhanced WebP conversion với smart quality settings
  static convertToWebP(imageUrl: string, quality: number = 90): string {
    if (!imageUrl) return imageUrl
    
    try {
      // Skip nếu đã là converted URL
      if (imageUrl.includes('phimapi.com/image.php')) {
        return imageUrl
      }
      
      // Smart quality based on image type và device
      const smartQuality = imageUrl.includes('thumb') ? 85 : quality
      
      const encodedUrl = encodeURIComponent(imageUrl)
      const webpUrl = `https://phimapi.com/image.php?url=${encodedUrl}&quality=${smartQuality}&format=webp`
      
      return webpUrl
    } catch (error) {
      console.error('WebP conversion error:', error)
      return imageUrl // Graceful fallback
    }
  }

  // Chuyển đổi dữ liệu từ API thành format của ứng dụng
  private static transformMovieData(items: any[]): Movie[] {
    return items.map(item => this.transformSingleMovie(item)).filter(Boolean) as Movie[]
  }

  private static transformSingleMovie(item: any): Movie | null {
    try {

      
      // Try multiple image fields to get the best poster
      const posterUrl = item.poster_url || item.thumb_url || item.image || item.poster
      const thumbUrl = item.thumb_url || item.thumbnail || item.poster_url || item.image
      const backdropUrl = item.poster_url || item.backdrop || item.thumb_url || item.image
      
      return {
        id: item.slug || item._id || item.id, // Ưu tiên slug làm ID chính
        title: item.name || item.title,
        originalTitle: item.origin_name || item.original_name,
        slug: item.slug,
        description: item.content || item.description || item.description || 'Chưa có mô tả cho phim này.',
        poster: this.convertImageUrl(posterUrl),
        thumbnail: this.convertImageUrl(thumbUrl),
        backdrop: this.convertImageUrl(backdropUrl),
        // Ưu tiên TMDB data cho rating (như ảnh API response bạn cung cấp)
        rating: parseFloat(item.vote_average || item.tmdb?.vote_average || item.rating || '6.0'),
        imdbRating: parseFloat(item.imdb?.rating || item.tmdb?.vote_average || item.vote_average || '0'),
        voteAverage: parseFloat(item.vote_average || item.tmdb?.vote_average || '0') || undefined,
        voteCount: parseInt(item.vote_count || item.tmdb?.vote_count || '0') || undefined,
        totalEpisodes: this.extractTotalEpisodes(item.episode_current, item.episode_total),
        currentEpisode: this.extractCurrentEpisode(item.episode_current),
        year: item.year || new Date().getFullYear(),
        // Improved country handling để support anime filtering
        country: Array.isArray(item.country) ? item.country[0]?.name : item.country?.name || 'N/A',
        countryData: Array.isArray(item.country) ? item.country : (item.country ? [item.country] : []),
        
        genres: Array.isArray(item.category) 
          ? item.category.map((cat: any) => cat.name || cat).filter(Boolean)
          : [item.category?.name || 'Phim'],
        categories: Array.isArray(item.category) 
          ? item.category.map((cat: any) => ({
              id: cat.id || cat.slug || cat.name,
              name: cat.name || cat,
              slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || ''
            })).filter(Boolean)
          : item.category ? [{
              id: item.category.id || item.category.slug || item.category.name || 'default',
              name: item.category.name || item.category || 'Phim',
              slug: item.category.slug || item.category.name?.toLowerCase().replace(/\s+/g, '-') || 'phim'
            }] : [],
        duration: this.parseDuration(item.time) || 120,
        quality: item.quality || item.lang || 'HD',
        isCompleted: item.status === 'completed' || item.episode_current === item.episode_total,
        episodes: this.transformEpisodes(item.episodes || []),
        views: item.view || 0,
        type: this.determineMovieType(item), // Sử dụng logic cải thiện để xác định type
        apiType: item.type, // Giữ nguyên type từ API để debug
        tmdbId: item.tmdb?.id,
        trailer: item.trailer_url || '',
        releaseDate: item.created?.time || new Date().toISOString(),
        director: Array.isArray(item.director) ? item.director.join(', ') : item.director || '',
        cast: Array.isArray(item.actor) ? item.actor : [],
      }
    } catch (error) {
      console.error('Lỗi chuyển đổi dữ liệu phim:', error)
      return null
    }
  }

  // Chuyển đổi chi tiết phim (có thêm episodes)
  private static transformSingleMovieDetail(item: any): Movie | null {
    const movie = this.transformSingleMovie(item)
    if (!movie) return null

    // Override description với content chi tiết nếu có
    if (item.content && item.content.trim()) {
      movie.description = item.content.trim()
    }

    // Thêm xử lý episodes chi tiết
    if (item.episodes && Array.isArray(item.episodes)) {
      movie.episodes = this.transformEpisodes(item.episodes)
    }

    return movie
  }

  // Chuyển đổi episodes
  private static transformEpisodes(episodes: any[]): any[] {
    return episodes.map(serverGroup => ({
      serverName: serverGroup.server_name || 'Server #1',
      episodes: serverGroup.server_data?.map((ep: any) => ({
        id: ep.slug || ep.name,
        episodeNumber: this.extractEpisodeNumber(ep.name),
        title: ep.name,
        duration: 0,
        videoUrl: ep.link_m3u8 || ep.link_embed || '',
        thumbnail: ''
      })) || []
    }))
  }

  // Extract current episode từ episode_current string
  private static extractCurrentEpisode(episodeCurrent: string): number | undefined {
    if (!episodeCurrent) return undefined
    
    // Xử lý các format: "Tập 34", "Tập 1", "Hoàn Tất (6/6)"
    const tapMatch = episodeCurrent.match(/Tập\s*(\d+)/)
    if (tapMatch) {
      return parseInt(tapMatch[1])
    }
    
    const hoanTatMatch = episodeCurrent.match(/Hoàn Tất\s*\((\d+)\/(\d+)\)/)
    if (hoanTatMatch) {
      return parseInt(hoanTatMatch[2]) // Trả về tổng số tập
    }
    
    return undefined
  }

  // Extract total episodes từ episode_current string
  private static extractTotalEpisodes(episodeCurrent: string, episodeTotal: string): number {
    if (episodeTotal) {
      const total = parseInt(episodeTotal)
      if (total > 0) return total
    }
    
    if (!episodeCurrent) return 0
    
    // Xử lý "Hoàn Tất (6/6)" để lấy tổng số tập
    const hoanTatMatch = episodeCurrent.match(/Hoàn Tất\s*\((\d+)\/(\d+)\)/)
    if (hoanTatMatch) {
      return parseInt(hoanTatMatch[2])
    }
    
    // Nếu có "Tập X" thì ít nhất có X tập
    const tapMatch = episodeCurrent.match(/Tập\s*(\d+)/)
    if (tapMatch) {
      return parseInt(tapMatch[1])
    }
    
    return 0
  }

  // Parse thời lượng từ string
  private static parseDuration(timeString: string): number {
    if (!timeString) return 120
    
    const match = timeString.match(/(\d+)\s*ph[ú|u]t/)
    return match ? parseInt(match[1]) : 120
  }

  // Xác định type phim dựa trên nhiều thông tin
  private static determineMovieType(item: any): 'movie' | 'tv' | 'single' | 'series' | 'hoathinh' {
    // Ưu tiên type từ API nếu có
    if (item.type) {
      const mappedType = this.mapApiType(item.type)
      if (mappedType !== 'movie') {
        return mappedType
      }
    }

    // Xác định dựa trên episodes
    const totalEpisodes = this.extractTotalEpisodes(item.episode_current, item.episode_total)
    const hasMultipleEpisodes = totalEpisodes > 1
    const hasEpisodesData = item.episodes && Array.isArray(item.episodes) && item.episodes.length > 0

    // Kiểm tra nếu có nhiều tập -> series
    if (hasMultipleEpisodes || hasEpisodesData) {
      // Kiểm tra xem có phải hoạt hình không
      if (this.isAnimation(item)) {
        return 'hoathinh'
      }
      return 'series'
    }

    // Kiểm tra hoạt hình cho phim lẻ
    if (this.isAnimation(item)) {
      return 'hoathinh'
    }

    // Mặc định là phim lẻ
    return 'single'
  }

  // Kiểm tra xem có phải hoạt hình không - Enhanced detection
  private static isAnimation(item: any): boolean {
    const title = (item.name || item.title || '').toLowerCase()
    const description = (item.content || item.description || '').toLowerCase()
    const genres = Array.isArray(item.category) 
      ? item.category.map((cat: any) => (cat.name || cat || '').toLowerCase()).join(' ')
      : (item.category?.name || '').toLowerCase()
    
    // Expanded animation keywords với các từ khóa anime phổ biến
    const animationKeywords = [
      // Vietnamese
      'hoạt hình', 'anime', 'phim hoạt hình',
      // English  
      'animation', 'animated', 'cartoon',
      // Japanese terms
      'manga', 'otaku', 'shounen', 'shoujo', 'seinen', 'josei',
      // Common anime genres
      'mecha', 'isekai', 'slice of life', 'magical girl'
    ]
    
    // Common anime title patterns
    const animePatterns = [
      /\s(wo|ga|no|ni|de|to|wa|o)\s/i, // Japanese particles
      /season\s*\d+/i, // Season numbering common in anime
      /\d+(st|nd|rd|th)\s*season/i,
      /(op|ed)\s*\d+/i, // Opening/Ending references
      /\b(kun|chan|san|sama|sensei|senpai|kohai)\b/i // Japanese honorifics
    ]
    
    // Check keywords
    const hasKeyword = animationKeywords.some(keyword => 
      title.includes(keyword) || 
      description.includes(keyword) || 
      genres.includes(keyword)
    )
    
    // Check patterns
    const hasAnimePattern = animePatterns.some(pattern => 
      pattern.test(title) || pattern.test(description)
    )
    
    return hasKeyword || hasAnimePattern
  }

  // Kiểm tra xem có phải từ Nhật Bản không
  private static isFromJapan(item: any): boolean {
    if (!item) return false
    
    // Check multiple country fields
    const countryFields = [
      item.country,
      item.origin_country,
      item.nationality,
      ...(Array.isArray(item.country) ? item.country : [])
    ]
    
    const countryText = countryFields
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    
    const japanKeywords = [
      'nhật bản', 'japan', 'japanese', 'jp',
      'nippon', 'nihon', '日本'
    ]
    
    return japanKeywords.some(keyword => 
      countryText.includes(keyword)
    )
  }

  // Kiểm tra anime Nhật Bản (kết hợp cả 2 điều kiện)
  private static isJapaneseAnime(item: any): boolean {
    const isAnime = this.isAnimation(item)
    const isJapan = this.isFromJapan(item)
    
    // Nếu có cả 2 điều kiện -> chắc chắn là anime Nhật
    if (isAnime && isJapan) return true
    
    // Nếu có type hoạt hình từ API -> có thể là anime
    if (item.type === 'hoathinh' || item.apiType === 'hoathinh') {
      return true
    }
    
    // Nếu từ Nhật và có đặc trưng anime -> có thể là anime
    if (isJapan && this.hasAnimeCharacteristics(item)) {
      return true
    }
    
    return false
  }

  // Kiểm tra đặc trưng anime
  private static hasAnimeCharacteristics(item: any): boolean {
    const title = (item.name || item.title || '').toLowerCase()
    
    // Các pattern đặc trưng của anime
    const animeCharacteristics = [
      /\b(season|mùa)\s*\d+/i,
      /\b(ep|tập)\s*\d+/i,
      /\b(ova|ona|movie)\b/i,
      /\b(shonen|shoujo|seinen|josei)\b/i,
      /\b(dragon|ball|naruto|one piece|attack on titan)\b/i,
      // Japanese title patterns
      /^[a-z\s]*\s*[A-Z][a-z]*\s*(no|wa|ga|wo|ni)\s*/i
    ]
    
    return animeCharacteristics.some(pattern => pattern.test(title))
  }

  // Kiểm tra API type anime trực tiếp (PERFORMANCE OPTIMIZED)
  private static hasApiAnimeType(movie: any): boolean {
    // 1. Check API type field trực tiếp - FASTEST CHECK
    if (movie.type === 'hoathinh' || movie.apiType === 'hoathinh') {
      return true
    }
    
    // 2. Check category từ API data
    if (Array.isArray(movie.categories)) {
      const hasAnimationCategory = movie.categories.some((cat: any) => {
        const categoryName = (cat.name || cat.slug || cat).toLowerCase()
        return categoryName.includes('hoat-hinh') || 
               categoryName.includes('hoạt hình') ||
               categoryName.includes('animation')
      })
      if (hasAnimationCategory) return true
    }
    
    // 3. Check countryData từ API cho performance tối ưu
    if (Array.isArray(movie.countryData)) {
      const isFromJapan = movie.countryData.some((c: any) => 
        (c.name || '').toLowerCase().includes('nhật bản') ||
        (c.slug || '').includes('nhat-ban') ||
        (c.name || '').toLowerCase().includes('japan')
      )
      
      // Nếu từ Nhật Bản và có keyword anime -> có thể là anime
      if (isFromJapan) {
        const title = (movie.name || movie.title || '').toLowerCase()
        const hasAnimeIndicator = title.includes('anime') || 
                                 title.includes('hoạt hình') ||
                                 title.includes('アニメ') ||
                                 // Common anime patterns
                                 /season\s*\d+/i.test(title) ||
                                 /\b(shounen|shoujo|seinen|josei)\b/i.test(title)
        
        if (hasAnimeIndicator) return true
      }
    }
    
    return false
  }

  // Map API type sang internal type system
  private static mapApiType(apiType: string): 'movie' | 'tv' | 'single' | 'series' | 'hoathinh' {
    if (!apiType) return 'movie'
    
    const type = apiType.toLowerCase()
    
    // Giữ nguyên các type từ API
    switch (type) {
      case 'single':
        return 'single'  // Phim lẻ
      case 'series':
        return 'series'  // Phim bộ
      case 'hoathinh':
        return 'hoathinh' // Phim hoạt hình
      case 'tv':
        return 'tv'
      case 'movie':
        return 'movie'
      default:
        // Fallback logic cho các type khác
        if (type.includes('series') || type.includes('bo') || type.includes('phim-bo')) {
          return 'series'
        }
        if (type.includes('hoat') || type.includes('anime')) {
          return 'hoathinh'
        }
        if (type.includes('le') || type.includes('phim-le')) {
          return 'single'
        }
        // Không default thành 'single', để giá trị gốc hoặc 'movie'
        return 'movie'
    }
  }

  // Extract episode number từ tên tập
  private static extractEpisodeNumber(episodeName: string): number {
    const match = episodeName.match(/(\d+)/)
    return match ? parseInt(match[1]) : 1
  }
}

// Hook để sử dụng trong React components
export const usePhimAPI = () => {
  return {
    getNewMovies: PhimAPIService.getNewMovies,
    getTVSeries: PhimAPIService.getTVSeries,
    getMovies: PhimAPIService.getMovies,
    getMovieDetail: PhimAPIService.getMovieDetail,
    searchMovies: PhimAPIService.searchMovies,
    convertImageUrl: PhimAPIService.convertImageUrl,
  }
}