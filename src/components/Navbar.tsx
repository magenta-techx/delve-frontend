'use client';
import { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AuthFormButton from './auth/AuthFormButton';
import Logo from './ui/Logo';
import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import LoginIcon from '@/assets/icons/auth/LoginIcon';
import SignUpIcon from '@/assets/icons/auth/SignUpIcon';
import Link from 'next/link';
import PersonIcon from '@/assets/icons/business/PersonIcon';
import MarketPlaceIcon from '@/assets/icons/business/MarketPlaceIcon';
import DefaultLogoTextIconWhite from '@/assets/icons/logo/DefaultLogoTextIconWhite';
import MarketPlaceIconBlack from '@/assets/icons/business/MarketPlaceIconBlack';
import PersonIconWhite from '@/assets/icons/business/PersonIconWhite';
import { Button } from './ui/Button';
import MenuBarIcon from '@/assets/icons/MenuBarIcon';
import CancleIcon from '@/assets/icons/CancelIcon';
import MenuBarIconWhite from '@/assets/icons/MenuBarIconWhite';

interface AuthFormButtonProps {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}

interface LinkProps {
  text: string;
  href: string;
}

interface NavbarProps {
  type?: string;
  authFormButtons?: boolean;
}
const Navbar = ({ type, authFormButtons = true }: NavbarProps): JSX.Element => {
  const router = useRouter();
  const [showMobileMenuItems, setShowMobileMenuItems] = useState(false);
  const handleAuthRouter = (login: string = 'true'): void => {
    router.push(`/auth/signin-signup?login=${login}`);
  };

  const pathname = usePathname();

  const SELECT_PLAN = '/business/select-plan';

  const AUTH_FORM_BUTTONS: AuthFormButtonProps[] = [
    {
      text: 'log in',
      icon: <LoginIcon />,
      onClick: () => handleAuthRouter('true'),
    },
    {
      text: 'sign up',
      icon: <SignUpIcon />,
      onClick: () => handleAuthRouter('false'),
    },
  ];

  const BUSINESS_LINKS: LinkProps[] = [
    {
      text: 'Business Type',
      href: '/',
    },
    {
      text: 'Pricing',
      href: '/',
    },
  ];

  const MOBILE_MENU_ITEMS = [
    {
      text: 'Home',
      href: '/',
    },
    {
      text: 'Listings',
      href: '/',
    },
    {
      text: 'Cities',
      href: '/',
    },
    {
      text: 'Blog',
      href: '/',
    },
    {
      text: 'FAQ',
      href: '/',
    },
  ];

  const linkClassName =
    type === 'business' ? 'text-white bg-black' : 'text-black bg-white';
  const marketPlaceIcon =
    type === 'business' ? <MarketPlaceIcon /> : <MarketPlaceIconBlack />;
  const menuBarIcon =
    type === 'business' ? <MenuBarIcon /> : <MenuBarIconWhite />;

  const variant = type === 'business' ? 'black' : 'white';
  const loginSignup = type === 'business' ? '' : 'text-white';
  return (
    <div
      className={`z-50 flex h-24 w-full items-center justify-center ${type === 'business' ? 'bg-primary-50' : type === 'community' ? 'bg-black/10 backdrop-blur-sm' : ''} ${authFormButtons ? 'py-0' : 'py-4'} px-5 sm:px-20 ${showMobileMenuItems ? 'fixed' : ''}`}
    >
      <div
        className={`flex w-[1280px] items-center ${showMobileMenuItems ? 'justify-end' : 'justify-between'}`}
      >
        {/* logo  */}
        {showMobileMenuItems ? (
          ''
        ) : (
          <div className='flex w-full items-center gap-20'>
            <Logo
              icon={
                type === 'community' ? (
                  <DefaultLogoTextIconWhite />
                ) : (
                  <DefaultLogoTextIcon />
                )
              }
              link='/'
            />
            {type && (
              <div className='hidden gap-10 sm:flex'>
                {type === 'business' &&
                  BUSINESS_LINKS.map((link, key) => {
                    return (
                      <Link key={key} href={link.href}>
                        {link.text}
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        )}
        {authFormButtons && (
          <div className='hidden w-[300px] rounded-xl border border-neutral-100 bg-neutral p-[2px] text-sm sm:flex'>
            {AUTH_FORM_BUTTONS.map((button, key) => (
              <AuthFormButton
                key={key}
                text={button.text}
                icon={button.icon}
                onClick={button.onClick}
              />
            ))}
          </div>
        )}
        {type && (
          <div className='hidden w-80 items-center gap-5 sm:flex'>
            {type && (
              <Link
                href={'auth/signin-signup'}
                className={`flex w-[300px] items-center gap-2 text-sm ${loginSignup}`}
              >
                {type === 'business' ? (
                  <PersonIcon />
                ) : type === 'community' ? (
                  <PersonIconWhite />
                ) : (
                  ''
                )}
                Login / Sign up
              </Link>
            )}
            {type && (
              <Button asChild className='w-[200px] text-xs' variant={variant}>
                <Link href={'/'} className={`flex gap-2 ${linkClassName}`}>
                  Market place {marketPlaceIcon}
                </Link>
              </Button>
            )}
          </div>
        )}

        {pathname === SELECT_PLAN ? (
          <div className='w-24'>
            <Button variant='neutral' className='text-gray-600'>
              Cancel
            </Button>
          </div>
        ) : (
          ''
        )}

        {/* Mobile menu bar  */}
        <div className='sm:hidden'>
          <Button
            onClick={() => {
              console.log('Clicked');
              setShowMobileMenuItems(!showMobileMenuItems);
            }}
            variant='ghost'
          >
            {showMobileMenuItems ? <CancleIcon /> : menuBarIcon}
          </Button>

          {/* Mobile Menu items  */}
          {showMobileMenuItems && (
            <div className='absolute left-0 top-20 z-20 h-screen w-full bg-white px-5 pt-4 font-inter'>
              <div className='mb-4 flex flex-col gap-10 border-b-[1px] border-gray-300 pb-4'>
                {MOBILE_MENU_ITEMS.map((menu, key) => {
                  return (
                    <Link key={key} href={menu.href} className='font-medium'>
                      {menu.text}
                    </Link>
                  );
                })}
              </div>
              <Link href={'/'}>Logout</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
