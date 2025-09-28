'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signIn, getSession, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FaFacebook, FaUser, FaLock, FaEnvelope, FaSpinner } from 'react-icons/fa'
import { BiError } from 'react-icons/bi'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  // Handle OAuth errors
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setError('Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.')
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!formData.identifier.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại')
      setLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError('Vui lòng nhập mật khẩu')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Email/số điện thoại hoặc mật khẩu không đúng')
      } else {
        // Đăng nhập thành công
        const session = await getSession()
        if (session) {
          router.push('/')
          router.refresh()
        }
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại!')
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    try {
      setOauthLoading('google')
      await signIn('google', { 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập với Google')
      setOauthLoading('')
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      setOauthLoading('facebook')
      await signIn('facebook', { 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập với Facebook')
      setOauthLoading('')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-red-500 text-4xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-red-500/25 transition-shadow duration-300">
              <span className="text-white font-bold text-3xl">R</span>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
            Chào mừng trở lại
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Đăng nhập để tiếp tục xem phim
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                <BiError className="text-lg flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email/Phone Input */}
              <div className="relative">
                <label htmlFor="identifier" className="sr-only">
                  Email hoặc số điện thoại
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Email hoặc số điện thoại"
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Mật khẩu
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                {loading ? (
                  <div className="flex items-center">
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800 text-gray-400">Hoặc tiếp tục với</span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="mt-6 space-y-3">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || oauthLoading === 'google'}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-xl shadow-sm text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {oauthLoading === 'google' ? (
                  <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <FcGoogle className="h-5 w-5 mr-3" />
                )}
                Đăng nhập với Google
              </button>

              {/* Facebook Sign In */}
              <button
                type="button"
                onClick={handleFacebookSignIn}
                disabled={loading || oauthLoading === 'facebook'}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600/20 hover:bg-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {oauthLoading === 'facebook' ? (
                  <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <FaFacebook className="h-5 w-5 mr-3 text-blue-500" />
                )}
                Đăng nhập với Facebook
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Chưa có tài khoản?{' '}
              <Link 
                href="/register" 
                className="font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}