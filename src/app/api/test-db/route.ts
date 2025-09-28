import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await dbConnect()
    console.log('✅ Database connected successfully')
    
    // Test user model
    const userCount = await User.countDocuments()
    console.log(`📊 Total users in database: ${userCount}`)
    
    // Test creating a simple user
    const testUser = {
      name: 'DB Test User',
      email: 'dbtest@example.com',
      password: 'test123',
      watchlist: []
    }
    
    // Check if test user exists
    const existingUser = await User.findOne({ email: testUser.email })
    
    if (!existingUser) {
      const newUser = await User.create(testUser)
      console.log('✅ Test user created:', newUser._id)
    } else {
      console.log('✅ Test user already exists:', existingUser._id)
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        totalUsers: userCount,
        testUser: existingUser ? 'exists' : 'created'
      }
    })
  } catch (error) {
    console.error('❌ Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Database connection failed'
    }, { status: 500 })
  }
}