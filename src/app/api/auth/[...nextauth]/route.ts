import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    }),
    FacebookProvider({
      clientId: process.env['FACEBOOK_CLIENT_ID']!,
      clientSecret: process.env['FACEBOOK_CLIENT_SECRET']!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(
          `${process.env['API_BASE_URL']}/user/auth/token/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        const user = await res.json();

        if (res.ok && user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin-signup',
    signOut: '/auth/signin-signup',
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
