'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, Menu, X, Bell, User, ChevronDown, LogOut, Settings, Heart, UserPlus, LogIn } from 'lucide-react'

// Static data for menu categories
const categories = [
  { id: '1', name: 'Hành Động', slug: 'hanh-dong' },
  { id: '2', name: 'Tình Cảm', slug: 'tinh-cam' },
  { id: '3', name: 'Hài Hước', slug: 'hai-huoc' },
  { id: '4', name: 'Kinh Dị', slug: 'kinh-di' },
  { id: '5', name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' },
  { id: '6', name: 'Hoạt Hình', slug: 'hoat-hinh' }
]

const countries = [
  { id: '1', name: 'Việt Nam', slug: 'viet-nam', flag: '🇻🇳' },
  { id: '2', name: 'Hàn Quốc', slug: 'han-quoc', flag: '🇰🇷' },
  { id: '3', name: 'Trung Quốc', slug: 'trung-quoc', flag: '🇨🇳' },
  { id: '4', name: 'Nhật Bản', slug: 'nhat-ban', flag: '🇯🇵' },
  { id: '5', name: 'Thái Lan', slug: 'thai-lan', flag: '🇹🇭' },
  { id: '6', name: 'Âu Mỹ', slug: 'au-my', flag: '🇺🇸' }
]

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black bg-opacity-95 backdrop-blur-md' : 'bg-gradient-to-b from-black from-opacity-80 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">MKP</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-white/80 transition-colors font-medium text-sm">
              Trang chủ
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-white hover:text-gray-300 transition-colors flex items-center font-medium text-sm">
                Thể loại
                <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-3 w-64 bg-black bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-800">
                <div className="p-2 grid grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-red-600 hover:bg-opacity-20 hover:text-white rounded-md transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Countries Dropdown */}
            <div className="relative group">
              <button className="text-white hover:text-gray-300 transition-colors flex items-center font-medium text-sm">
                Quốc gia
                <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-3 w-56 bg-black bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-800">
                <div className="p-2">
                  {countries.map((country) => (
                    <Link
                      key={country.id}
                      href={`/country/${country.slug}`}
                      className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-red-600 hover:bg-opacity-20 hover:text-white rounded-md transition-colors"
                    >
                      <span className="mr-3 text-lg">{country.flag}</span>
                      {country.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/phim-le" className="text-white hover:text-gray-300 transition-colors font-medium text-sm">
              Phim lẻ
            </Link>
            <Link href="/phim-bo" className="text-white hover:text-gray-300 transition-colors font-medium text-sm">
              Phim bộ
            </Link>
            <Link href="/top-imdb" className="text-white hover:text-gray-300 transition-colors font-medium text-sm">
              Top IMDb
            </Link>
          </nav>

          {/* Right side - Search, Notifications, Profile */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm phim, diễn viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black bg-opacity-40 border border-gray-700 text-white pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-72 placeholder-gray-400 backdrop-blur-sm text-sm"
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Notifications */}
            <button className="text-white hover:text-gray-300 transition-colors p-2">
              <Bell className="h-6 w-6" />
            </button>

            {/* Authentication Section */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
            ) : session ? (
              /* Logged in user menu */
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-600">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-800 z-50">
                    <div className="p-1">
                      {/* User Info */}
                      <div className="px-3 py-3 border-b border-gray-800">
                        <p className="text-white font-medium text-sm">{session.user?.name}</p>
                        <p className="text-gray-400 text-xs">{session.user?.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <Link 
                        href="/profile" 
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors m-1"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Thông tin cá nhân</span>
                      </Link>
                      
                      <Link 
                        href="/watchlist" 
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors m-1"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Danh sách yêu thích</span>
                      </Link>
                      
                      <div className="border-t border-gray-800 my-1"></div>
                      
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 rounded-lg transition-colors m-1 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in - Login/Register buttons */
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white hover:text-gray-300 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </Link>
                <Link 
                  href="/register"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-black bg-opacity-95 backdrop-blur-md border-t border-gray-800">
            {/* Mobile Authentication */}
            {session ? (
              <div className="border-b border-gray-800 pb-3 mb-3">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-600">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{session.user?.name}</p>
                    <p className="text-gray-400 text-xs">{session.user?.email}</p>
                  </div>
                </div>
                
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-red-600/20 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Thông tin cá nhân</span>
                </Link>
                
                <Link 
                  href="/watchlist" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-red-600/20 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  <span>Danh sách yêu thích</span>
                </Link>
                
                <button 
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="border-b border-gray-800 pb-3 mb-3 space-y-2">
                <Link 
                  href="/login"
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </Link>
                <Link 
                  href="/register"
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}

            {/* Mobile Navigation Menu Items */}
            <div className="space-y-1">
                  <Link href="/settings" className="block px-3 py-2 text-sm text-gray-300 hover:bg-red-600 hover:bg-opacity-20 hover:text-white rounded-md transition-colors">
                    Cài đặt
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-red-400 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-lg mt-2">
              <Link href="/" className="block px-3 py-2 text-white hover:text-red-400">
                Trang chủ
              </Link>
              <Link href="/phim-le" className="block px-3 py-2 text-white hover:text-red-400">
                Phim lẻ
              </Link>
              <Link href="/phim-bo" className="block px-3 py-2 text-white hover:text-red-400">
                Phim bộ
              </Link>
              
              {/* Mobile Categories */}
              <div className="px-3 py-2">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Thể loại</h3>
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-2 py-1 text-sm text-white hover:text-red-400"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Countries */}
              <div className="px-3 py-2">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Quốc gia</h3>
                <div className="grid grid-cols-2 gap-1">
                  {countries.map((country) => (
                    <Link
                      key={country.id}
                      href={`/country/${country.slug}`}
                      className="block px-2 py-1 text-sm text-white hover:text-red-400"
                    >
                      {country.flag} {country.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm phim..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
