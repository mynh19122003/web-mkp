import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

// GET - Lấy danh sách watchlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', isInWatchlist: false },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', data: [] },
        { status: 404 }
      )
    }

    const userWatchlist = user.watchlist || []
    
    // Kiểm tra xem có cần lấy thông tin chi tiết không
    const { searchParams } = new URL(request.url)
    const withDetails = searchParams.get('withDetails') === 'true'
    
    if (withDetails && userWatchlist.length > 0) {
      try {
        // Import PhimAPIService để lấy thông tin chi tiết
        const { PhimAPIService } = await import('@/services/kkphim')
        
        console.log(`🎬 Fetching details for ${userWatchlist.length} movies...`)
        const startTime = Date.now()
        
        // Lấy thông tin chi tiết cho từng phim - tăng timeout và parallel processing
        const movieDetails = await Promise.allSettled(
          userWatchlist.map(async (movieId: string) => {
            try {
              // Thử getMovieDetail trước (nhanh hơn getMovieById)
              const movie = await PhimAPIService.getMovieDetail(movieId)
              return movie
            } catch (error) {
              console.warn(`⚠️ Could not fetch movie ${movieId}:`, error)
              return null
            }
          })
        )
        
        // Lọc ra các phim có thông tin hợp lệ
        const validMovies = movieDetails
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => (result as PromiseFulfilledResult<any>).value)
        
        const endTime = Date.now()
        console.log(`⚡ Fetched ${validMovies.length}/${userWatchlist.length} movies in ${endTime - startTime}ms`)
        
        return NextResponse.json({
          success: true,
          data: validMovies,
          movieIds: userWatchlist,
          total: userWatchlist.length,
          validMovies: validMovies.length,
          fetchTime: endTime - startTime,
          userEmail: session.user.email
        })
      } catch (error) {
        console.error('Error fetching movie details:', error)
        // Fallback về danh sách ID nếu có lỗi
        return NextResponse.json({
          success: true,
          data: userWatchlist,
          total: userWatchlist.length,
          userEmail: session.user.email,
          error: 'Could not fetch movie details'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      data: userWatchlist,
      total: userWatchlist.length,
      userEmail: session.user.email
    })
  } catch (error) {
    console.error('Get watchlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Thêm phim vào watchlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { movieId } = await request.json()
    
    if (!movieId) {
      return NextResponse.json(
        { success: false, error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Kiểm tra xem phim đã có trong watchlist chưa
    if (user.watchlist.includes(movieId)) {
      return NextResponse.json(
        { success: false, error: 'Movie already in watchlist' },
        { status: 400 }
      )
    }

    // Thêm phim vào watchlist
    user.watchlist.push(movieId)
    await user.save()

    console.log(`✅ Added movie ${movieId} to watchlist for ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Movie added to watchlist',
      data: user.watchlist
    })
  } catch (error) {
    console.error('Add to watchlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Xóa phim khỏi watchlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('movieId')
    
    if (!movieId) {
      return NextResponse.json(
        { success: false, error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Xóa phim khỏi watchlist
    user.watchlist = user.watchlist.filter((id: string) => id !== movieId)
    await user.save()

    console.log(`✅ Removed movie ${movieId} from watchlist for ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Movie removed from watchlist',
      data: user.watchlist
    })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}