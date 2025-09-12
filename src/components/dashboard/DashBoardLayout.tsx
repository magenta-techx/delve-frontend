'use client';

import { signOut, useSession } from 'next-auth/react';

const DashBoardLayout = (): JSX.Element => {
  const { data: session } = useSession();

  console.log('Session in Dashboard: ', session);

  return (
    <div className='flex items-center gap-3'>
      {session?.user.name}
      <button
        className='rounded bg-primary px-3 py-1 text-white'
        onClick={() =>
          signOut({ redirect: true, callbackUrl: '/auth/signin-signup' })
        }
      >
        Sign Out
      </button>
    </div>
  );
};

export default DashBoardLayout;
