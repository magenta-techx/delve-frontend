'use client'

import { checkIsIOS, disableIOSTextFieldZoom } from '@/utils/inputs';
import * as React from 'react';



export function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  React.useEffect(() => {
    // Check if the current device is iOS and disable text field zooming.
    if (checkIsIOS()) {
      disableIOSTextFieldZoom();
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}
