import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, getUserByEmail } from '@/lib/memoryDb'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    // Validation
    if (!name || !password) {
      return NextResponse.json(
        { message: 'Họ tên và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    if (!email && !phone) {
      return NextResponse.json(
        { message: 'Vui lòng nhập email hoặc số điện thoại' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Check if user already exists (check email first)
    if (email) {
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { message: 'Người dùng với email này đã tồn tại' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await createUser({
      name,
      email: email || undefined,
      phone: phone || undefined,
      password: hashedPassword,
      provider: 'credentials'
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Không thể tạo tài khoản. Vui lòng thử lại.' },
        { status: 500 }
      )
    }

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }

    return NextResponse.json(
      { message: 'Đăng ký thành công!', user: userResponse },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Registration error:', error)
    
    return NextResponse.json(
      { message: 'Có lỗi xảy ra trên server. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}