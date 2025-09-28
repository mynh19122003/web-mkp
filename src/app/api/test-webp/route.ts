import { PhimAPIService } from '@/services/kkphim'
import { NextResponse } from 'next/server'

// Test endpoint để kiểm tra WebP conversion
export async function GET() {
  try {
    const testUrls = [
      'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg',
      'https://phimimg.com/upload/vod/20220308-1/2022030815083217.jpg',
      '/upload/vod/test.jpg'
    ]

    const conversions = testUrls.map(url => ({
      original: url,
      converted: PhimAPIService.convertToWebP(url, 90),
      optimized: PhimAPIService.convertImageUrl(url, 'poster')
    }))

    return NextResponse.json({
      success: true,
      message: 'WebP conversion test',
      conversions,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}