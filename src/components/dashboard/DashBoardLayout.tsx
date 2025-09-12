'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { clearBusinessData } from '@/redux/slices/businessSlice';

const DashBoardLayout = (): JSX.Element => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  console.log('Session in Dashboard: ', session);

  const handleLogOut = (): void => {
    dispatch(clearBusinessData());
    signOut({ redirect: true, callbackUrl: '/auth/signin-signup' });
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
