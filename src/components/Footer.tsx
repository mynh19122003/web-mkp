import Link from 'next/link'
import { Facebook, Youtube, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-20 backdrop-blur-netflix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Social Links */}
        <div className="flex space-x-6 mb-8">
          <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 glow-border rounded-full p-2">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 glow-border rounded-full p-2">
            <Youtube className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 glow-border rounded-full p-2">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 glow-border rounded-full p-2">
            <Instagram className="h-6 w-6" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <ul className="space-y-3">
              <li>
                <Link href="/hoi-dap" className="text-gray-400 hover:text-white transition-all duration-300 text-sm hover:text-shadow-hero">
                  Hỏi - Đáp
                </Link>
              </li>
              <li>
                <Link href="/trung-tam-tro-giup" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/tai-khoan" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tài khoản
                </Link>
              </li>
              <li>
                <Link href="/trung-tam-bao-chi" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Trung tâm báo chí
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-3">
              <li>
                <Link href="/quan-he-nha-dau-tu" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Quan hệ nhà đầu tư
                </Link>
              </li>
              <li>
                <Link href="/viec-lam" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Việc làm
                </Link>
              </li>
              <li>
                <Link href="/phuong-thuc-xem" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Phương thức xem
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan-su-dung" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              <li>
                <Link href="/bao-mat" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Bảo mật
                </Link>
              </li>
              <li>
                <Link href="/tuy-chon-cookie" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tùy chọn cookie
                </Link>
              </li>
              <li>
                <Link href="/thong-tin-cong-ty" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Thông tin công ty
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Liên hệ với chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              <li>
                <Link href="/the-qua-tang" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Thẻ quà tặng
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan-phap-ly" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Điều khoản pháp lý
                </Link>
              </li>
              <li>
                <Link href="/thong-tin-media" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Thông tin media
                </Link>
              </li>
              <li>
                <Link href="/chi-co-tren-rophim" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chỉ có trên RoPhim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Service Code Button */}
        <button className="mb-8 px-4 py-2 border border-gray-600 text-gray-400 text-sm hover:text-white hover:border-gray-400 transition-colors">
          Mã dịch vụ
        </button>

        {/* Copyright */}
        <div className="text-gray-500 text-xs space-y-2">
          <p>© 1997-2024 RoPhim, Inc.</p>
          <p>RoPhim Việt Nam - chúng tôi cung cấp dịch vụ theo giấy phép của công ty giải trí địa phương.</p>
        </div>
      </div>
    </footer>
  )
}
