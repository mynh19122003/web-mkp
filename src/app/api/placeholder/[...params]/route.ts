import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const resolvedParams = await params;
    const [width, height] = resolvedParams.params;
    const w = parseInt(width) || 400;
    const h = parseInt(height) || 600;

    // Tạo SVG placeholder với kích thước được yêu cầu
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1f2937"/>
        <rect x="10%" y="10%" width="80%" height="80%" fill="#374151" rx="8"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="16" 
          fill="#9ca3af" 
          text-anchor="middle" 
          dy="0.3em"
        >
          ${w}×${h}
        </text>
        <circle cx="40%" cy="35%" r="15" fill="#4b5563"/>
        <polygon points="35%,30% 35%,40% 45%,35%" fill="#6b7280"/>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Lỗi tạo placeholder image:', error);
    
    // Fallback đơn giản
    const fallbackSvg = `
      <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1f2937"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle">Poster</text>
      </svg>
    `;
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }
}