import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          await dbConnect()

          // Check if identifier is email or phone
          const isEmail = credentials.identifier.includes('@')
          const query = isEmail 
            ? { email: credentials.identifier }
            : { phone: credentials.identifier }

          const user = await User.findOne(query)

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
            id: user._id.toString(),
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
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect()
          
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google'
            })
          }
        } catch (error) {
          console.error('Error saving user:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/login'
  }
})

export { handler as GET, handler as POST }