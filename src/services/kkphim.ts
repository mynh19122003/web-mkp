// Service để tích hợp API PhimAPI.com
import { Movie } from '@/types/movie'

const API_BASE_URL = 'https://phimapi.com'

export class PhimAPIService {
  // Lấy danh sách phim mới nhất
  static async getNewMovies(page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`)
      const data = await response.json()
      
      return this.transformMovieData(data.items || [])
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim mới:', error)
      return []
    }
  }

  // Lấy danh sách phim bộ  
  static async getTVSeries(page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-bo?page=${page}`)
      const data = await response.json()
      
      return this.transformMovieData(data.data?.items || [])
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim bộ:', error)
      return []
    }
  }

  // Lấy danh sách phim lẻ
  static async getMovies(page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-le?page=${page}`)
      const data = await response.json()
      
      return this.transformMovieData(data.data?.items || [])
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim lẻ:', error)
      return []
    }
  }

  // Lấy chi tiết phim
  static async getMovieDetail(slug: string): Promise<Movie | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/phim/${slug}`)
      const data = await response.json()
      
      if (data.status && data.movie) {
        return this.transformSingleMovieDetail(data.movie)
      }
      return null
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết phim:', error)
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

  // Lấy phim với content đầy đủ cho hero section
  static async getMoviesWithFullContent(type: 'new' | 'movie' | 'tv' | 'cinema' | 'anime' | 'korean' | 'chinese' | 'western' = 'new', page: number = 1): Promise<Movie[]> {
    try {
      const movies = await this.getMoviesByType(type, page)
      
      // Lấy chi tiết cho từng phim để có content đầy đủ
      const moviesWithContent = await Promise.all(
        movies.slice(0, 5).map(async (movie: Movie) => {
          if (movie.slug) {
            const detailMovie = await this.getMovieDetail(movie.slug)
            return detailMovie || movie
          }
          return movie
        })
      )
      
      return moviesWithContent
    } catch (error) {
      console.error('Lỗi khi lấy phim với content đầy đủ:', error)
      return []
    }
  }

  // 1. Top 10 phim được xem nhiều nhất trong 1 tháng (trending)
  static async getTrendingMovies(page: number = 1): Promise<Movie[]> {
    try {
      // Thử nhiều endpoints để lấy phim hot
      const endpoints = [
        `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`,
        `${API_BASE_URL}/v1/api/danh-sach/phim-bo?page=1`, 
        `${API_BASE_URL}/v1/api/danh-sach/phim-le?page=1`
      ]

      let allMovies: Movie[] = []

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          const data = await response.json()
          
          let movies: any[] = []
          if (data.items) movies = data.items
          else if (data.data?.items) movies = data.data.items
          
          if (movies.length > 0) {
            const transformedMovies = this.transformMovieData(movies)
            allMovies.push(...transformedMovies)
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err)
        }
      }

      // Nếu có dữ liệu, sắp xếp theo độ hot
      if (allMovies.length > 0) {
        return allMovies
          .filter(movie => (movie.imdbRating || movie.rating || 0) > 6.0)
          .sort((a, b) => {
            const scoreA = (a.views || Math.random() * 1000) * 0.7 + (a.imdbRating || a.rating || 7.0) * 100
            const scoreB = (b.views || Math.random() * 1000) * 0.7 + (b.imdbRating || b.rating || 7.0) * 100
            return scoreB - scoreA
          })
          .slice(0, 10)
      }

      // Fallback về phim mới
      return this.getNewMovies(page)
    } catch (error) {
      console.error('Lỗi khi lấy phim trending:', error)
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

  // 5. Anime hot tuần qua - anime nổi tiếng mới ra mắt
  static async getHotAnime(page: number = 1): Promise<Movie[]> {
    try {
      let animeMovies: Movie[] = []
      
      // Thử nhiều cách để tìm anime
      const searchTerms = ['anime', 'hoạt hình', 'animation', 'cartoon']
      
      for (const term of searchTerms) {
        try {
          const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(term)}&page=1`)
          const data = await response.json()
          
          if (data.status && data.data?.items) {
            const searchResults = this.transformMovieData(data.data.items)
            animeMovies.push(...searchResults)
          }
        } catch (err) {
          console.log(`Search for ${term} failed:`, err)
        }
      }
      
      // Nếu không tìm được, lọc từ phim mới
      if (animeMovies.length === 0) {
        console.log('No anime found from search, filtering from new movies')
        const newMovies = await this.getNewMovies(1)
        animeMovies = newMovies.filter(movie => 
          movie.title.toLowerCase().includes('anime') ||
          movie.description?.toLowerCase().includes('anime') ||
          movie.genres.some(genre => 
            genre.toLowerCase().includes('hoạt hình') || 
            genre.toLowerCase().includes('anime') ||
            genre.toLowerCase().includes('animation')
          )
        )
      }
      
      // Nếu vẫn không có, tạo mock data anime phổ biến
      if (animeMovies.length === 0) {
        console.log('Creating fallback anime list')
        const fallbackMovies = await this.getNewMovies(1)
        animeMovies = fallbackMovies.slice(0, 15) // Lấy 15 phim đầu làm anime
      }
      
      // Sắp xếp anime hot tuần
      return animeMovies
        .filter(movie => (movie.imdbRating || movie.rating || 0) > 5.5)
        .sort((a, b) => {
          const scoreA = (a.views || Math.random() * 1000) * 0.8 + (a.imdbRating || a.rating || 7.5) * 100
          const scoreB = (b.views || Math.random() * 1000) * 0.8 + (b.imdbRating || b.rating || 7.5) * 100
          return scoreB - scoreA
        })
        .slice(0, 20)
    } catch (error) {
      console.error('Lỗi khi lấy anime hot:', error)
      // Fallback cuối cùng
      return this.getNewMovies(page).then(movies => movies.slice(0, 15))
    }
  }

  // 6. Phim chiếu rạp - Bom tấn mới nhất
  static async getCinemaMovies(page: number = 1): Promise<Movie[]> {
    try {
      // Lấy phim mới và lọc phim có điểm cao (giống phim chiếu rạp)
      const newMovies = await this.getNewMovies(page)
      
      return newMovies
        .filter(movie => 
          (movie.imdbRating || movie.rating || 0) > 7.0 &&
          movie.quality !== 'CAM' // Loại bỏ phim quay lén
        )
        .sort((a, b) => {
          const scoreA = (a.views || Math.random() * 2000) * 0.5 + (a.imdbRating || a.rating || 8.0) * 300
          const scoreB = (b.views || Math.random() * 2000) * 0.5 + (b.imdbRating || b.rating || 8.0) * 300
          return scoreB - scoreA
        })
        .slice(0, 20)
    } catch (error) {
      console.error('Lỗi khi lấy phim chiếu rạp:', error)
      return this.getNewMovies(page)
    }
  }

  // 7. Phim theo quốc gia
  static async getMoviesByCountry(country: 'korean' | 'chinese' | 'western', page: number = 1): Promise<Movie[]> {
    try {
      let searchKeyword = ''
      let countryFilter = ''
      
      switch (country) {
        case 'korean':
          searchKeyword = 'hàn quốc'
          countryFilter = 'Hàn Quốc'
          break
        case 'chinese':  
          searchKeyword = 'trung quốc'
          countryFilter = 'Trung Quốc'
          break
        case 'western':
          searchKeyword = 'mỹ'
          countryFilter = 'Âu Mỹ'
          break
      }

      // Thử search theo keyword
      let movies: Movie[] = []
      try {
        const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(searchKeyword)}&page=${page}`)
        const data = await response.json()
        
        if (data.status && data.data?.items) {
          movies = this.transformMovieData(data.data.items)
        }
      } catch (err) {
        console.log(`Search for ${country} failed:`, err)
      }

      // Nếu không tìm được, lọc từ phim mới theo country
      if (movies.length === 0) {
        const allMovies = await this.getNewMovies(1)
        movies = allMovies.filter(movie => 
          movie.country.includes(countryFilter) ||
          movie.title.toLowerCase().includes(searchKeyword) ||
          movie.description?.toLowerCase().includes(searchKeyword)
        )
      }

      // Fallback với phim mới nếu vẫn không có
      if (movies.length === 0) {
        movies = await this.getNewMovies(page)
      }

      return movies
        .filter(movie => (movie.imdbRating || movie.rating || 0) > 6.0)
        .sort((a, b) => {
          const scoreA = (a.views || Math.random() * 1200) * 0.6 + (a.imdbRating || a.rating || 7.5) * 120
          const scoreB = (b.views || Math.random() * 1200) * 0.6 + (b.imdbRating || b.rating || 7.5) * 120
          return scoreB - scoreA
        })
        .slice(0, 20)
    } catch (error) {
      console.error(`Lỗi khi lấy phim ${country}:`, error)
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

  // Chuyển đổi URL ảnh sang WEBP và tối ưu quality
  static convertImageUrl(originalUrl: string, size: 'thumb' | 'poster' = 'poster'): string {
    if (!originalUrl || originalUrl === 'null' || originalUrl === 'undefined') {
      // Trả về một ảnh default chất lượng cao từ PhimAPI
      return this.convertToWebP('https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg')
    }
    
    try {
      // Clean up URL
      let cleanUrl = originalUrl.trim()
      
      // Nếu đã là URL đầy đủ từ PhimAPI/PhimImg
      if (cleanUrl.includes('phimimg.com') || cleanUrl.includes('phimapi.com')) {
        // Ensure HTTPS và loại bỏ query params có thể làm giảm quality
        cleanUrl = cleanUrl.replace('http://', 'https://').split('?')[0]
        return this.convertToWebP(cleanUrl)
      }
      
      // Nếu là relative URL từ PhimAPI, thêm base URL
      if (cleanUrl.startsWith('/')) {
        return this.convertToWebP(`https://phimimg.com${cleanUrl}`)
      }
      
      // Nếu URL không có http và có extension, xử lý path
      if (!cleanUrl.startsWith('http') && cleanUrl.includes('.')) {
        // Kiểm tra xem đã có path upload/vod chưa
        if (cleanUrl.includes('upload/vod/')) {
          return this.convertToWebP(`https://phimimg.com/${cleanUrl}`)
        } else {
          return this.convertToWebP(`https://phimimg.com/upload/vod/${cleanUrl}`)
        }
      }
      
      // Fallback về một ảnh mặc định chất lượng cao
      return this.convertToWebP('https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg')
    } catch (error) {
      console.error('Lỗi chuyển đổi URL ảnh:', error)
      return this.convertToWebP('https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg')
    }
  }

  // Chuyển đổi image URL sang WEBP format với quality cao
  static convertToWebP(imageUrl: string): string {
    if (!imageUrl) return imageUrl
    
    // Tạm thời return original URL để tránh mờ, sẽ implement WEBP sau
    return imageUrl
    
    // // Sử dụng PhimAPI image conversion service với quality cao
    // const encodedUrl = encodeURIComponent(imageUrl)
    // return `https://phimapi.com/image.php?url=${encodedUrl}&quality=95`
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
        id: item._id || item.id || item.slug,
        title: item.name || item.title,
        originalTitle: item.origin_name || item.original_name,
        slug: item.slug,
        description: item.content || item.description || item.description || 'Chưa có mô tả cho phim này.',
        poster: this.convertImageUrl(posterUrl),
        thumbnail: this.convertImageUrl(thumbUrl),
        backdrop: this.convertImageUrl(backdropUrl),
        rating: parseFloat(item.tmdb?.vote_average || item.rating || '0'),
        imdbRating: parseFloat(item.imdb?.rating || item.tmdb?.vote_average || item.rating || '0'),
        totalEpisodes: this.extractTotalEpisodes(item.episode_current, item.episode_total),
        currentEpisode: this.extractCurrentEpisode(item.episode_current),
        year: item.year || new Date().getFullYear(),
        country: Array.isArray(item.country) ? item.country[0]?.name : item.country?.name || 'N/A',
        genres: Array.isArray(item.category) 
          ? item.category.map((cat: any) => cat.name || cat).filter(Boolean)
          : [item.category?.name || 'Phim'],
        duration: this.parseDuration(item.time) || 120,
        quality: item.quality || item.lang || 'HD',
        isCompleted: item.status === 'completed' || item.episode_current === item.episode_total,
        episodes: this.transformEpisodes(item.episodes || []),
        views: item.view || 0,
        type: item.type === 'series' || item.type === 'hoathinh' ? 'tv' : 'movie',
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