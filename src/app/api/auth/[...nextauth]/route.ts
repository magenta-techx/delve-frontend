import NextAuth, {
  DefaultSession,
  NextAuthOptions,
  Session,
  User,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { JWT } from 'next-auth/jwt';

/**
 * --- Type Augmentation ---
 */
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    is_brand_owner: boolean;
    number_of_owned_brands: number;
    is_active: boolean;
    current_plan: string;
    is_premium_plan_active: boolean;
    error: string;
  }
}

declare module 'next-auth' {
  interface User {
    accessToken: string;
    refreshToken: string;
    is_brand_owner: boolean;
    number_of_owned_brands: number;
    is_active: boolean;
    current_plan: string;
    is_premium_plan_active: boolean;
  }
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      is_brand_owner: boolean;
      number_of_owned_brands: number;
      is_active: boolean;
      current_plan: string;
      is_premium_plan_active: boolean;
      error: string;
    } & DefaultSession['user'];
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env['API_BASE_URL']}/user/auth/token/refresh/`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: token['refreshToken'] }),
      }
    );

    const refreshedTokens = await res.json();

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens?.data?.access,
      accessTokenExpires: Date.now() + 55 * 60 * 1000, 
      refreshToken: refreshedTokens?.data?.refresh ?? token.refreshToken, 
      error: '', 
    };
  } catch (error) {
    console.log('Refresh token error:', error);
    console.log('Refresh token used:', token['refreshToken']);
    
    return {
      ...token,
      accessToken: '',
      accessTokenExpires: 0,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

  providers: [
    //   process.env['GOOGLE_CLIENT_ID'] && process.env['GOOGLE_CLIENT_SECRET']
    //   ? GoogleProvider({
    //       clientId: process.env['GOOGLE_CLIENT_ID'] as string,
    //       clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
    //     })
    //   : null,
    // process.env['FACEBOOK_CLIENT_ID'] && process.env['FACEBOOK_CLIENT_SECRET']
    //   ? FacebookProvider({
    //       clientId: process.env['FACEBOOK_CLIENT_ID'] as string,
    //       clientSecret: process.env['FACEBOOK_CLIENT_SECRET'] as string,
    //     })
    //   : null,
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
          current_plan: user.current_plan,
          is_premium_plan_active: user.is_premium_plan_active,
        };
      },
    }),
  ],

  pages: {
    signIn: '/signin',
    signOut: '/signin',
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }): Promise<JWT> {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 55 * 60 * 1000; // expires in 55 minutes
        token.is_brand_owner = user.is_brand_owner;
        token.number_of_owned_brands = user.number_of_owned_brands;
        token.is_active = user.is_active;
        token.current_plan = user.current_plan;
        token.is_premium_plan_active = user.is_premium_plan_active;
        // Persist name/email/image too so session callback can read consistently
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
      }

      // Refresh the token 5 minutes before actual expiration
      const refreshBuffer = 5 * 60 * 1000;
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - refreshBuffer &&
        token.accessToken &&
        !token.error
      ) {
        return token;
      }

      // If token is expired or within buffer, try to refresh
      return refreshAccessToken(token);
    },
    async session({
      session,
      token,
    }: {
      session: Session | DefaultSession;
      token: JWT;
    }): Promise<Session | DefaultSession> {
      if (token) {
        session.user = {
          ...session.user,
          // Basic identity
          name: token.name ?? null,
          email: token.email ?? null,
          image: token.picture ?? null,
          // App-specific flags
          is_active: token.is_active ?? null,
          is_brand_owner: token.is_brand_owner ?? null,
          is_premium_plan_active: token.is_premium_plan_active ?? null,
          current_plan: token.current_plan ?? null,
          number_of_owned_brands: token.number_of_owned_brands ?? null,
          // Expose tokens to client when needed (e.g., fetch to our API routes)
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          error: token.error ?? '',
        };
      }
      // If refresh failed, force sign out on client
      if (token?.error === 'RefreshAccessTokenError') {
        // Optionally, you can log or handle this event here
        // The client should check session.user.error and sign out if present
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
