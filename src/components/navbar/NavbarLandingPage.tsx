import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon'
import MenuBarIcon from '@/assets/icons/MenuBarIcon'
import React from 'react'

const NavbarLandingPage = ():JSX.Element => {
  return (
      <div className='flex items-center justify-between w-full px-5 pt-10 pb-5'>
          <div className='w-[80px] h-[19.22px] flex items-center justify-center'>
              <DefaultLogoTextIcon />
          </div>
          <MenuBarIcon />
    </div>
  )
}

export default NavbarLandingPage