'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';

type Props = {
  children: ReactNode;
  session: Session | null;
};

export default function SessionProviderWrapper({
  children,
  session,
}: Props): JSX.Element {
  // if (session === null) {
  //   console.log('Session is currently none');
  //   return <>{session}</>;
  // }

  return (
    <SessionProvider session={session}>{children}</SessionProvider>
  );
}
