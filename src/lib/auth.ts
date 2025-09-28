import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail, createUser, getUserById } from '@/lib/memoryDb'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
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
    async jwt({ token, user, account }: any) {
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
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          // Kiểm tra xem user đã tồn tại chưa
          const existingUser = await getUserByEmail(user.email)
          
          if (!existingUser) {
            // Tạo user mới cho OAuth
            const newUser = await createUser({
              name: user.name || '',
              email: user.email || '',
              image: user.image || '',
              provider: account.provider
            })
            
            if (newUser) {
              user.id = newUser._id?.toString() || newUser.email
            }
          } else {
            user.id = existingUser._id?.toString() || existingUser.email
          }
        } catch (error) {
          console.error('OAuth sign in error:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/login'
  }
}