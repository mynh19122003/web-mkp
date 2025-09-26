'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.password) {
      setError('Tên và mật khẩu là bắt buộc')
      return
    }

    if (!formData.email && !formData.phone) {
      setError('Vui lòng nhập email hoặc số điện thoại')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

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

      if (response.ok) {
        // Đăng ký thành công, tự động đăng nhập
        const identifier = formData.email || formData.phone
        const result = await signIn('credentials', {
          identifier,
          password: formData.password,
          redirect: false
        })

        if (result?.ok) {
          router.push('/')
          router.refresh()
        } else {
          // Nếu auto login thất bại, chuyển đến trang đăng nhập
          router.push('/login')
        }
      } else {
        setError(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại!')
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập với Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Tạo tài khoản MKP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Hoặc{' '}
            <Link href="/login" className="font-medium text-red-500 hover:text-red-400">
              đăng nhập vào tài khoản có sẵn
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Họ và tên
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Email (tùy chọn)"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Số điện thoại (tùy chọn)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pr-10 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pr-10 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Đăng ký với Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}