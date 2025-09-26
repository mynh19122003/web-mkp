import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format movie type từ API thành display name
export function formatMovieType(apiType?: string, fallbackType?: string): string {
  if (!apiType && !fallbackType) return 'N/A'
  
  const type = apiType || fallbackType
  
  switch (type?.toLowerCase()) {
    case 'single':
      return 'LẺ'
    case 'series':
      return 'BỘ' 
    case 'hoathinh':
      return 'HOẠT HÌNH'
    case 'movie':
      return 'LẺ'  // Map movie cũ thành LẺ
    case 'tv':
      return 'BỘ'  // Map TV cũ thành BỘ
    default:
      return type?.toUpperCase() || 'N/A'
  }
}

// Get type color cho badge
export function getTypeColor(apiType?: string, fallbackType?: string): string {
  const type = apiType || fallbackType
  
  switch (type?.toLowerCase()) {
    case 'single':
      return 'bg-blue-600'    // Xanh dương cho phim lẻ
    case 'series':
      return 'bg-green-600'   // Xanh lá cho phim bộ
    case 'hoathinh':
      return 'bg-purple-600'  // Tím cho hoạt hình
    case 'movie':
      return 'bg-blue-600'    // Map movie cũ thành màu phim lẻ
    case 'tv':
      return 'bg-green-600'   // Map TV cũ thành màu phim bộ
    default:
      return 'bg-gray-600'
  }
}
