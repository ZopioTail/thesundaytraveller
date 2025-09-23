import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1)

          if (!user[0]) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user[0].passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await db
            .update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, user[0].id))

          return {
            id: user[0].id.toString(),
            email: user[0].email,
            name: `${user[0].firstName} ${user[0].lastName}`,
            username: user[0].username,
            role: user[0].role,
            avatar: user[0].avatar,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.username = token.username as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    signOut: '/admin/logout',
  },
}

declare module 'next-auth' {
  interface User {
    role: string
    username: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      username: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    username: string
  }
}