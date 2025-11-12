'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/Button';

const DashBoardLayout = (): JSX.Element => {
  const { data: session } = useSession();

  // console.log('Session in Dashboard: ', session);

  const handleLogOut = (): void => {
    signOut({ redirect: true, callbackUrl: '/signin' });
  };

  return (
    <div className='flex items-center gap-3'>
      {session?.user.name}
      <Button
        className='rounded bg-primary px-3 py-1 text-white'
        onClick={handleLogOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default DashBoardLayout;
