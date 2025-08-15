// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID'] as string,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
    }),
    FacebookProvider({
      clientId: process.env['FACEBOOK_CLIENT_ID'] as string,
      clientSecret: process.env['FACEBOOK_CLIENT_SECRET'] as string,
    }),
    AppleProvider({
      clientId: process.env['APPLE_CLIENT_ID'] as string,
      clientSecret: process.env['APPLE_CLIENT_SECRET'] as string,
    }),
  ],
  // session: {
  //   strategy: 'jwt', // you can use "database" if configured
  // },
  // pages: {
  //   signIn: '/auth/signin', // Optional custom sign-in page
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
