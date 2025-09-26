import Link from 'next/link'
import { FileX, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <FileX className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Phim Không Tồn Tại</h2>
          <p className="text-gray-400 mb-8">
            Rất tiếc, chúng tôi không thể tìm thấy phim bạn đang tìm kiếm. 
            Phim có thể đã bị xóa hoặc liên kết không chính xác.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded inline-flex items-center gap-3 transition-colors"
          >
            <Home className="w-5 h-5" />
            Về Trang Chủ
          </Link>
          
          <div className="block">
            <Link 
              href="/tim-kiem"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded inline-flex items-center gap-3 transition-colors border border-gray-600"
            >
              <Search className="w-5 h-5" />
              Tìm Kiếm Phim
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}