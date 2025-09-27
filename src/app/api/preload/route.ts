import { PhimAPIService } from '@/services/kkphim'
import { NextResponse } from 'next/server'

// API endpoint để preload cache
export async function GET() {
  try {
    // Trigger cache preload (non-blocking)
    PhimAPIService.preloadCache()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache preload initiated' 
    })
  } catch (error) {
    console.error('Preload error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Preload failed' 
    })
  }
}