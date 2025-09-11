'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

const DashBoardLayout = (): JSX.Element => {
  return (
    <div>
      {' '}
      <button
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
