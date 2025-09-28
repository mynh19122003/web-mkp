import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'



// STUB API - Deprecated, always return empty data to prevent 404 errors

export async function GET(request: NextRequest) {

  return NextResponse.json({// STUB API - Deprecated, always return empty data to prevent 404 errorsimport { getMongoClient } from '@/lib/memoryDb'

    success: true,

    data: [],export async function GET(request: NextRequest) {

    message: 'API deprecated - use /api/watchlist instead'

  })  console.warn('⚠️ API watchlist-test is deprecated. Returning empty data.')// STUB API - Deprecated, always return empty data

}

  return NextResponse.json({

export async function POST(request: NextRequest) {

  return NextResponse.json({    success: true,export async function GET(request: NextRequest) {// Mock API để test watchlist trực tiếp với Memory Server

    success: false,

    message: 'API deprecated - use /api/watchlist instead'    data: [],

  })

}    message: 'API deprecated - use /api/watchlist instead'  console.warn('⚠️ API watchlist-test is deprecated. Returning empty data.')const TEST_USER_EMAIL = 'test@watchlist.com'



export async function DELETE(request: NextRequest) {  })

  return NextResponse.json({

    success: false,}  return NextResponse.json({

    message: 'API deprecated - use /api/watchlist instead'

  })

}
export async function POST(request: NextRequest) {    success: true,// GET - Lấy danh sách watchlist của user test

  console.warn('⚠️ API watchlist-test POST is deprecated. No operation performed.')

  return NextResponse.json({    data: [],export async function GET() {

    success: false,

    message: 'API deprecated - use /api/watchlist instead'    message: 'API deprecated - use /api/watchlist instead'  try {    

  })

}  })    const client = await getMongoClient()



export async function DELETE(request: NextRequest) {}    const db = client.db('watchlistdb')

  console.warn('⚠️ API watchlist-test DELETE is deprecated. No operation performed.')

  return NextResponse.json({    const user = await db.collection('users').findOne({ email: TEST_USER_EMAIL })

    success: false,

    message: 'API deprecated - use /api/watchlist instead'export async function POST(request: NextRequest) {    

  })

}  console.warn('⚠️ API watchlist-test is deprecated. No operation performed.')    if (!user) {

  return NextResponse.json({      return NextResponse.json({

    success: false,        success: false,

    message: 'API deprecated - use /api/watchlist instead'        error: 'User not found'

  })      }, { status: 404 })

}    }



export async function DELETE(request: NextRequest) {    return NextResponse.json({

  console.warn('⚠️ API watchlist-test is deprecated. No operation performed.')      success: true,

  return NextResponse.json({      data: user.watchlist || []

    success: false,    })

    message: 'API deprecated - use /api/watchlist instead'  } catch (error) {

  })    console.error('Get watchlist error:', error)

}    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE - Xóa phim khỏi watchlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('movieId')
    
    if (!movieId) {
      return NextResponse.json({
        success: false,
        error: 'Movie ID is required'
      }, { status: 400 })
    }

    const client = await getMongoClient()
    const db = client.db('watchlistdb')
    
    const userData = await db.collection('users').findOne({ email: TEST_USER_EMAIL })
    if (!userData) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    const currentWatchlist = userData.watchlist || []
    const newWatchlist = currentWatchlist.filter((id: string) => id !== movieId)
    
    const result = await db.collection('users').updateOne(
      { email: TEST_USER_EMAIL },
      { $set: { watchlist: newWatchlist } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Movie removed from watchlist',
      data: newWatchlist
    })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST - Thêm phim vào watchlist
export async function POST(request: NextRequest) {
  try {
    const { movieId } = await request.json()
    
    if (!movieId) {
      return NextResponse.json({
        success: false,
        error: 'Movie ID is required'
      }, { status: 400 })
    }

    const client = await getMongoClient()
    const db = client.db('watchlistdb')
    
    const user = await db.collection('users').findOne({ email: TEST_USER_EMAIL })
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    const currentWatchlist = user.watchlist || []
    
    // Kiểm tra xem phim đã có trong watchlist chưa
    if (currentWatchlist.includes(movieId)) {
      return NextResponse.json({
        success: false,
        error: 'Movie already in watchlist'
      }, { status: 400 })
    }

    // Thêm phim vào watchlist
    const newWatchlist = [...currentWatchlist, movieId]
    
    await db.collection('users').updateOne(
      { email: TEST_USER_EMAIL },
      { $set: { watchlist: newWatchlist } }
    )

    return NextResponse.json({
      success: true,
      message: 'Movie added to watchlist',
      data: newWatchlist
    })
  } catch (error) {
    console.error('Add to watchlist error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}