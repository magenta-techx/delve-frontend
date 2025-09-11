import NextAuth, {
  DefaultSession,
  // DefaultSession,
  NextAuthOptions,
  // Session,
  User,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { JWT } from 'next-auth/jwt';

/**
 * --- Type Augmentation ---
 */
declare module 'next-auth' {
  interface User {
    accessToken: string;
    refreshToken: string;
    is_brand_owner: boolean;
    number_of_owned_brands: number;
    is_active: boolean;

    is_premium_plan_active: boolean;
  }
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    is_brand_owner: boolean;
    number_of_owned_brands: number;
    is_active: boolean;

    is_premium_plan_active: boolean;
    error: string;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
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

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens?.data?.access,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // expires in 1 hour
      refreshToken: refreshedTokens?.data?.refresh ?? token.refreshToken, // fall back to old one
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
      async authorize(credentials): Promise<User | null> {
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

        const result = await res.json();
        if (!res.ok || !result?.data) return null;

        const { user, tokens } = result.data;

        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          image: user.profile_image,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,

          is_brand_owner: user.is_brand_owner,
          number_of_owned_brands: user.number_of_owned_brands,
          is_active: user.is_active,

          is_premium_plan_active: user.is_premium_plan_active,
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
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        token.is_brand_owner = user.is_brand_owner;
        token.number_of_owned_brands = user.number_of_owned_brands;
        token.is_active = user.is_active;

        token.is_premium_plan_active = user.is_premium_plan_active;
      }

      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires &&
        token.accessToken
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
