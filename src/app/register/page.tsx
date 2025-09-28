'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FaFacebook, FaUser, FaLock, FaEnvelope, FaPhone, FaSpinner, FaCheck } from 'react-icons/fa'
import { BiError } from 'react-icons/bi'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  // Password strength checker
  useEffect(() => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1
    setPasswordStrength(strength)
  }, [formData.password])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ tên')
      return false
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại')
      return false
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ')
      return false
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra')
      }

      setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...')
      
      // Auto login after successful registration
      setTimeout(async () => {
        const result = await signIn('credentials', {
          identifier: formData.email || formData.phone,
          password: formData.password,
          redirect: false
        })

        if (result?.ok) {
          router.push('/')
        } else {
          router.push('/login')
        }
      }, 1500)

    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!')
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
      setError('Có lỗi xảy ra khi đăng ký với Google')
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
      setError('Có lỗi xảy ra khi đăng ký với Facebook')
      setOauthLoading('')
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return { text: 'Rất yếu', color: 'text-red-500' }
      case 1: return { text: 'Yếu', color: 'text-orange-500' }
      case 2: return { text: 'Trung bình', color: 'text-yellow-500' }
      case 3: return { text: 'Mạnh', color: 'text-green-500' }
      case 4: return { text: 'Rất mạnh', color: 'text-green-600' }
      default: return { text: '', color: '' }
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
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Tham gia RoPhim để xem phim miễn phí
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

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                <FaCheck className="flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <label htmlFor="name" className="sr-only">
                  Họ tên
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Họ tên"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Email (tùy chọn)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone Input */}
              <div className="relative">
                <label htmlFor="phone" className="sr-only">
                  Số điện thoại
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Số điện thoại (tùy chọn)"
                  value={formData.phone}
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < passwordStrength
                            ? passwordStrength === 1
                              ? 'bg-red-500'
                              : passwordStrength === 2
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${getPasswordStrengthText().color}`}>
                    Độ mạnh mật khẩu: {getPasswordStrengthText().text}
                  </p>
                </div>
              )}

              {/* Confirm Password Input */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Xác nhận mật khẩu
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-300 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-red-400 hover:text-red-300">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-red-400 hover:text-red-300">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            {/* Register Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                {loading ? (
                  <div className="flex items-center">
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Đang đăng ký...
                  </div>
                ) : (
                  'Đăng ký'
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
                  <span className="px-4 bg-gray-800 text-gray-400">Hoặc đăng ký với</span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="mt-6 space-y-3">
              {/* Google Sign Up */}
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
                Đăng ký với Google
              </button>

              {/* Facebook Sign Up */}
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
                Đăng ký với Facebook
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Đã có tài khoản?{' '}
              <Link 
                href="/login" 
                className="font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}