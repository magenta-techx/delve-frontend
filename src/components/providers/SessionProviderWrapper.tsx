'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';

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
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
