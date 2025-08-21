import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

import { JWT } from 'next-auth/jwt';

interface JWTToken extends JWT {
  accessToken?: string;
  refreshToken?: string | undefined;
  accessTokenExpires?: number;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  error?: string;
}

async function refreshAccessToken(token: JWTToken): Promise<JWTToken> {
  try {
    const res = await fetch(
      `${process.env['API_BASE_URL']}/user/auth/token/refresh/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: token.refreshToken }),
      }
    );

    const refreshedTokens: { access: string; refresh?: string } =
      await res.json();

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // adjust for backend expiry
      refreshToken: refreshedTokens.refresh ?? token.refreshToken,
    };
  } catch (error) {
    console.warn('Refresh token error:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

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
    async jwt({ token, user }): Promise<JWTToken> {
      // Initial login
      if (user) {
        return {
          ...token,
        };
      }

      // If token is still valid, return it
      if (Date.now() < (token['accessTokenExpires'] as number)) {
        return token as JWTToken;
      }

      // Otherwise refresh
      return await refreshAccessToken(token as JWTToken);
    },
    async session({
      session,
      // token,
    }): Promise<Session & { accessToken?: string; error?: string }> {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
