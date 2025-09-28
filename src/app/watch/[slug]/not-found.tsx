import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-8xl font-bold text-red-600 mb-6">404</div>
        <h1 className="text-3xl font-bold mb-4">Không tìm thấy phim</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Rất tiếc, chúng tôi không thể tìm thấy bộ phim bạn đang tìm kiếm. 
          Có thể phim đã bị gỡ bỏ hoặc đường link không chính xác.
        </p>
        <div className="space-x-4">
          <Link 
            href="/"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Về trang chủ
          </Link>
          <Link 
            href="/phim"
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Tìm phim khác
          </Link>
        </div>
      </div>
    </div>
  )
}