import NextAuth, { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
  }
  interface Session {
    user: {
      accessToken?: string | undefined;
      refreshToken?: string | undefined;
    } & DefaultSession['user'];
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log('refreshedTokens token: ', token);
  try {
    const res = await fetch(
      `${process.env['API_BASE_URL']}/user/auth/token/refresh/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: token['refreshToken'] }),
      }
    );

    const refreshedTokens = await res.json();

    console.log('refreshedTokens: ', refreshedTokens?.data?.access);
    console.log(' refreshedTokens.access: ', refreshedTokens.access);

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens?.data?.access,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // adjust for backend expiry
      refreshToken: refreshedTokens?.data?.refresh,
    };
  } catch (error) {
    console.warn('Refresh token error:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

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
        console.log('credentials: ', credentials);

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

        const result = await res.json();

        if (!res.ok || !result?.data) return null;

        const { user, tokens } = result.data;

        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role ?? null,
          image: user.profile_image,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
        };
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin-signup',
    signOut: '/auth/signin-signup',
  },

  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      // Initial login
      if (user) {
        console.log(' Initial login JWT user :', user);
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000; // token last an hour after login
      }
      if (token && Date.now() < (token.accessTokenExpires as number)) {
        console.log(' Initial login JWT token check:', token);
      }

      // If token still valid
      if (
        Date.now() < (token.accessTokenExpires as number) &&
        token.accessToken
      ) {
        return token;
      }

      // Otherwise refresh
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      console.log('Session session: ', session);
      console.log('Session token: ', token);

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
