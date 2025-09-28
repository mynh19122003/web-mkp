import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getUserByEmail } from '@/lib/memoryDb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Vui lòng đăng nhập' },
        { status: 401 }
      )
    }

    const { movieIds } = await request.json()

    if (!movieIds || !Array.isArray(movieIds) || movieIds.length === 0) {
      return NextResponse.json(
        { message: 'movieIds is required and must be an array' },
        { status: 400 }
      )
    }

    // Limit batch size to prevent abuse
    if (movieIds.length > 50) {
      return NextResponse.json(
        { message: 'Tối đa 50 movies mỗi lần check' },
        { status: 400 }
      )
    }

    const user = await getUserByEmail(session.user.email)
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    const userWatchlist = user.watchlist || []
    
    // Create status object for all requested movies
    const watchlistStatus: Record<string, boolean> = {}
    movieIds.forEach((movieId: string) => {
      watchlistStatus[movieId] = userWatchlist.includes(movieId)
    })

    return NextResponse.json({
      watchlistStatus,
      total: movieIds.length,
      inWatchlist: Object.values(watchlistStatus).filter(Boolean).length
    })

  } catch (error) {
    console.error('Batch watchlist check error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}