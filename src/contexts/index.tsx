import React from 'react';
import { getServerSession } from 'next-auth';

import { Toaster } from '@/components/ui/sonner';
import { SavedBusinessesProvider } from '@/contexts/SavedBusinessesContext';
import { UserProvider } from '@/contexts/UserContext';

import SessionProviderWrapper from '@/contexts/SessionProviderWrapper';
import QueryProvider from '@/contexts/QueryProvider';
import { NotificationProvider } from '@/contexts/NotificationProvider';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


const AllProvider = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  return (
    <SessionProviderWrapper session={session}>
      <QueryProvider >
        <UserProvider>
          <SavedBusinessesProvider>
            <NotificationProvider>
              <Toaster />
              {children}
            </NotificationProvider>
          </SavedBusinessesProvider>
        </UserProvider>
      </QueryProvider>
    </SessionProviderWrapper>
  );
};

export default AllProvider;
