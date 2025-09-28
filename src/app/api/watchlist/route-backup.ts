import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Temporary in-memory storage for testing
const mockWatchlists: Record<string, string[]> = {}

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

    const userWatchlist = mockWatchlists[session.user.email] || []
    
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

    const userEmail = session.user.email
    if (!mockWatchlists[userEmail]) {
      mockWatchlists[userEmail] = []
    }

    const currentWatchlist = mockWatchlists[userEmail]
    
    // Kiểm tra xem phim đã có trong watchlist chưa
    if (currentWatchlist.includes(movieId)) {
      return NextResponse.json(
        { success: false, error: 'Movie already in watchlist' },
        { status: 400 }
      )
    }

    // Thêm phim vào watchlist
    mockWatchlists[userEmail].push(movieId)

    console.log(`✅ Added movie ${movieId} to watchlist for ${userEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Movie added to watchlist',
      data: mockWatchlists[userEmail]
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

    const userEmail = session.user.email
    if (!mockWatchlists[userEmail]) {
      mockWatchlists[userEmail] = []
    }

    // Xóa phim khỏi watchlist
    mockWatchlists[userEmail] = mockWatchlists[userEmail].filter(id => id !== movieId)

    console.log(`✅ Removed movie ${movieId} from watchlist for ${userEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Movie removed from watchlist',
      data: mockWatchlists[userEmail]
    })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}