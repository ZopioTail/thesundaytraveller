import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from './firebase'

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
          // Get user by email using direct Firestore query
          const usersRef = collection(firestoreDb, 'users')
          const q = query(usersRef, where('email', '==', credentials.email), where('isActive', '==', true))
          const querySnapshot = await getDocs(q)

          if (querySnapshot.empty) {
            return null
          }

          const userDoc = querySnapshot.docs[0]
          const user = userDoc.data()

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          const userRef = doc(firestoreDb, 'users', userDoc.id)
          await updateDoc(userRef, { lastLogin: Timestamp.now() })

          return {
            id: userDoc.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            username: user.username,
            role: user.role,
            avatar: user.avatar,
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