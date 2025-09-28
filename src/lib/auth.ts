import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/lib/memoryDb'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }

        try {
          // Check if identifier is email
          const isEmail = credentials.identifier.includes('@')
          if (!isEmail) {
            return null // Chỉ hỗ trợ email trong test
          }

          const user = await getUserByEmail(credentials.identifier)

          if (!user || !user.password) {
            return null
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordCorrect) {
            return null
          }

          return {
            id: user._id?.toString() || user.email,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    },
    async signIn({ user, account, profile }: any) {
      // Cho phép đăng nhập
      return true
    }
  },
  pages: {
    signIn: '/login'
  }
}