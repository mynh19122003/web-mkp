import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

// GET - Kiểm tra xem một phim có trong watchlist hay không (lightweight)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', isInWatchlist: false },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('movieId')
    
    if (!movieId) {
      return NextResponse.json(
        { success: false, error: 'Movie ID is required', isInWatchlist: false },
        { status: 400 }
      )
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', isInWatchlist: false },
        { status: 404 }
      )
    }

    const isInWatchlist = user.watchlist.includes(movieId)

    return NextResponse.json({
      success: true,
      isInWatchlist,
      movieId,
      userEmail: session.user.email
    })
  } catch (error) {
    console.error('Check watchlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', isInWatchlist: false },
      { status: 500 }
    )
  }
}