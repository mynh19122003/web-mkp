import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Play, Plus, ThumbsUp, Download, Star, Clock, Calendar, Eye, Globe, PlayCircle } from 'lucide-react'
import { PhimAPIService } from '@/services/kkphim'
import { Movie } from '@/types/movie'
import MovieRowWithAPI from '@/components/MovieRowWithAPI'
import VideoPlayer from '@/components/VideoPlayer'
import Breadcrumb from '@/components/Breadcrumb'
import ShareButton from '@/components/ShareButton'
import TrailerVideoPlayer from '@/components/TrailerVideoPlayer'
import SimpleWatchlistButton from '@/components/SimpleWatchlistButton'
import MovieDetails from '@/components/MovieDetails'
import MovieRating from '@/components/MovieRating'

interface MovieDetailPageProps {
  params: {
    slug: string
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { slug } = await params
  const movie = await PhimAPIService.getMovieDetail(slug)
  
  if (!movie) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Backdrop */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={movie.backdrop || movie.poster || 'https://phimapi.com/image.php?url=https%3A//phimimg.com/upload/vod/20220309-1/2022030915165476.jpg'}
            alt={movie.title}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl">
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
                {movie.title}
              </h1>
              
              {/* Original Title */}
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="text-lg md:text-xl text-gray-300 mb-4 font-medium">
                  {movie.originalTitle}
                </p>
              )}

              {/* Movie Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{(movie.imdbRating || movie.rating).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{movie.duration} phút</span>
                </div>
                <div className="bg-red-600 px-3 py-1 rounded text-sm font-bold">
                  {movie.quality}
                </div>
                {movie.views && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <span>{movie.views.toLocaleString()} lượt xem</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-gray-700"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-200 max-w-2xl">
                {movie.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href={`/watch/${movie.slug || movie.id}`}
                  className="bg-white text-black font-bold py-3 px-8 rounded hover:bg-gray-200 transition-all duration-200 flex items-center gap-3 shadow-lg hover:scale-105 hover:shadow-xl"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Xem Phim
                </a>
                
                <SimpleWatchlistButton 
                  movieId={movie.id} 
                  movieTitle={movie.title}
                  size="medium"
                />
                
                <button className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white font-semibold py-3 px-6 rounded hover:bg-gray-700 transition-all duration-200 flex items-center gap-3 hover:scale-105">
                  <ThumbsUp className="w-6 h-6" />
                  Thích
                </button>
                
                <ShareButton title={movie.title} url={`/phim/${slug}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="relative z-20 bg-black -mt-32 pt-32">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: 'Phim', href: '/phim' },
              { label: movie.title }
            ]} 
          />
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Trailer Section */}
              {movie.trailer && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <PlayCircle className="w-8 h-8 text-red-500" />
                      Trailer
                    </h2>
                  </div>
                  <TrailerVideoPlayer
                    trailerUrl={movie.trailer}
                    title={movie.title}
                    thumbnail={movie.backdrop || movie.poster}
                  />
                </div>
              )}

              {/* Episodes Section */}
              {movie.episodes && movie.episodes.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Danh Sách Tập</h2>
                  <div className="space-y-6">
                    {movie.episodes.map((serverGroup: any, serverIndex: number) => (
                      <div key={serverIndex} className="bg-gray-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-red-500 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          {serverGroup.serverName || `Server ${serverIndex + 1}`}
                        </h3>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                          {serverGroup.episodes?.slice(0, 50).map((episode: any, episodeIndex: number) => (
                            <button
                              key={episodeIndex}
                              className="bg-gray-800 hover:bg-red-600 text-white py-3 px-4 rounded text-sm font-medium transition-all duration-200 border border-gray-700 hover:border-red-500 hover:scale-105"
                            >
                              {episode.title || `Tập ${episode.episodeNumber || episodeIndex + 1}`}
                            </button>
                          ))}
                        </div>
                        {serverGroup.episodes && serverGroup.episodes.length > 50 && (
                          <button className="mt-4 text-red-500 hover:text-red-400 font-medium flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Xem thêm {serverGroup.episodes.length - 50} tập...
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Movie Details */}
              <MovieDetails movie={movie} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Movie Info */}
              <div className="bg-gray-900 rounded-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-6">Thông Tin Phim</h3>
                
                <div className="space-y-4">
                  <div>
                    <dt className="text-gray-400 text-sm mb-1">Năm Sản Xuất</dt>
                    <dd className="text-white font-medium">{movie.year}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-gray-400 text-sm mb-1">Quốc Gia</dt>
                    <dd className="text-white font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {movie.country}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-gray-400 text-sm mb-1">Thời Lượng</dt>
                    <dd className="text-white font-medium">{movie.duration} phút</dd>
                  </div>
                  
                  <div>
                    <dt className="text-gray-400 text-sm mb-1">Chất Lượng</dt>
                    <dd className="text-white font-medium">
                      <span className="bg-red-600 px-2 py-1 rounded text-sm">
                        {movie.quality}
                      </span>
                    </dd>
                  </div>
                  
                  {movie.totalEpisodes && (
                    <div>
                      <dt className="text-gray-400 text-sm mb-1">Số Tập</dt>
                      <dd className="text-white font-medium">
                        {movie.currentEpisode ? `${movie.currentEpisode}/${movie.totalEpisodes}` : movie.totalEpisodes} tập
                      </dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-gray-400 text-sm mb-1">Trạng Thái</dt>
                    <dd className="text-white font-medium">
                      <span className={`px-2 py-1 rounded text-sm ${movie.isCompleted ? 'bg-green-600' : 'bg-yellow-600'
                        }`}>
                        {movie.isCompleted ? 'Hoàn Thành' : 'Đang Cập Nhật'}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-gray-400 text-sm mb-1">Đánh Giá</dt>
                    <dd className="text-white font-medium flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {(movie.imdbRating || movie.rating).toFixed(1)}/10
                    </dd>
                  </div>
                  
                  {movie.views && (
                    <div>
                      <dt className="text-gray-400 text-sm mb-1">Lượt Xem</dt>
                      <dd className="text-white font-medium">
                        {movie.views.toLocaleString()}
                      </dd>
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Rating */}
              <MovieRating
                rating={movie.rating}
                imdbRating={movie.imdbRating}
                views={movie.views}
                title={movie.title}
              />
            </div>
          </div>
        </div>

        {/* Related Movies */}
        <div className="container mx-auto px-4 lg:px-8 pb-12">
          <MovieRowWithAPI
            title="Phim Tương Tự"
            type="new"
          />
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: MovieDetailPageProps) {
  const { slug } = await params
  const movie = await PhimAPIService.getMovieDetail(slug)
  
  if (!movie) {
    return {
      title: 'Phim không tồn tại | RoPhim',
      description: 'Phim bạn đang tìm kiếm không tồn tại trên hệ thống.'
    }
  }

  return {
    title: `${movie.title} (${movie.year}) | RoPhim`,
    description: movie.description || `Xem phim ${movie.title} (${movie.year}) chất lượng ${movie.quality} tại RoPhim`,
    openGraph: {
      title: `${movie.title} (${movie.year})`,
      description: movie.description,
      images: [movie.poster || movie.backdrop],
    },
  }
}