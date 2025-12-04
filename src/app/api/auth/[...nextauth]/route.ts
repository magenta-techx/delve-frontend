import NextAuth, {
  DefaultSession,
  NextAuthOptions,
  Session,
  User,
  Account,
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
    console.log('Refreshing access token...');
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

    console.log('Token refresh successful, new tokens received');
    // IMPORTANT: Backend returns a NEW refresh token after each use
    // The old refresh token is now invalid and cannot be reused
    return {
      ...token,
      accessToken: refreshedTokens?.data?.access,
      accessTokenExpires: Date.now() + 55 * 60 * 1000, 
      refreshToken: refreshedTokens?.data?.refresh, // Always use the new refresh token
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
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
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
        googleToken: { label: 'Google Token', type: 'text' },
      },
      async authorize(credentials): Promise<User | null> {
        console.log('=== AUTHORIZE CALLED ===');
        console.log('Has email:', !!credentials?.email);
        console.log('Has password:', !!credentials?.password);
        console.log('Has googleToken:', !!credentials?.googleToken);
        
        // Handle Google token login
        if (credentials?.googleToken) {
          console.log('=== GOOGLE TOKEN LOGIN ===');
          console.log('Received Google token, length:', credentials.googleToken.length);
          console.log('Token preview:', credentials.googleToken.substring(0, 50) + '...');
          console.log('API URL:', `${process.env['API_BASE_URL']}/user/auth/google/`);
          
          try {
            const res = await fetch(
              `${process.env['API_BASE_URL']}/user/auth/google/`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentials.googleToken }),
              }
            );

            const result = await res.json();
            console.log('Backend response:', { 
              status: res.status, 
              ok: res.ok, 
              result,
            });
            
            if (!res.ok || !result?.data) {
              console.error('Google auth error - Full response:', JSON.stringify(result, null, 2));
              throw new Error(result?.message || 'Backend authentication failed');
            }

            const { user, tokens } = result.data;
            console.log('Successfully authenticated user:', user.email);

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
          } catch (error) {
            console.error('Google auth exception:', error);
            throw error;
          }
        }

        // Handle email/password login
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
    async jwt({ token, user, account, trigger }: { token: JWT; user: User; account: Account | null; trigger?: string }): Promise<JWT> {
      console.log('JWT callback triggered:', { 
        trigger, 
        hasAccount: !!account, 
        hasUser: !!user,
        provider: account?.provider,
        hasIdToken: !!(account as Record<string, unknown>)?.['id_token'] 
      });

      // When signing in with Google, call backend API
      if (account?.provider === 'google') {
        try {
          // Access id_token from account
          const idToken = (account as Record<string, unknown>)['id_token'] as string | undefined;
          
          if (!idToken) {
            console.error('No id_token in account object:', Object.keys(account));
            return {
              ...token,
              error: 'NoIdToken',
            };
          }

          console.log('Calling backend with Google ID token...');
          const res = await fetch(
            `${process.env['API_BASE_URL']}/user/auth/google/`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: idToken }),
            }
          );

          const result = await res.json();
          console.log('Backend response:', { 
            ok: res.ok, 
            status: res.status,
            hasData: !!result?.data,
            message: result?.message 
          });
          
          if (res.ok && result?.data) {
            const { user: backendUser, tokens: backendTokens } = result.data;
            
            console.log('Successfully authenticated with backend, user:', backendUser.email);
            
            // Store backend tokens and user info
            return {
              ...token,
              accessToken: backendTokens.access,
              refreshToken: backendTokens.refresh,
              accessTokenExpires: Date.now() + 55 * 60 * 1000,
              is_brand_owner: backendUser.is_brand_owner,
              number_of_owned_brands: backendUser.number_of_owned_brands,
              is_active: backendUser.is_active,
              current_plan: backendUser.current_plan,
              is_premium_plan_active: backendUser.is_premium_plan_active,
              name: `${backendUser.first_name} ${backendUser.last_name}`,
              email: backendUser.email,
              picture: backendUser.profile_image,
              error: '',
            };
          } else {
            console.error('Backend returned error:', result);
            return {
              ...token,
              error: 'BackendAuthError',
            };
          }
        } catch (error) {
          console.error('Error calling backend for Google auth:', error);
          return {
            ...token,
            error: 'BackendAuthError',
          };
        }
      }
      
      // Handle credentials login
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 55 * 60 * 1000,
          is_brand_owner: user.is_brand_owner,
          number_of_owned_brands: user.number_of_owned_brands,
          is_active: user.is_active,
          current_plan: user.current_plan,
          is_premium_plan_active: user.is_premium_plan_active,
          name: user.name ?? null,
          email: user.email ?? null,
          error: '',
        };
      }

      // Only refresh if the token is actually expired (not proactively)
      // This prevents wasting single-use refresh tokens
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires &&
        token.accessToken &&
        !token.error
      ) {
        // Token is still valid, no refresh needed
        return token;
      }

      // Token is expired, try to refresh if we have a refresh token
      if (token.refreshToken && !token.error) {
        console.log('Access token expired, attempting refresh...');
        return refreshAccessToken(token);
      }
      
      // No refresh token available or previous error
      return token;
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
