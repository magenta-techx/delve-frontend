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
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';
import { useSession } from 'next-auth/react';
import ListingUserMenuExtension from './landing-page/UserMenuExtensions/ListingUserMenuExtension';
// import { selectUserIsLoggedIn } from '@/redux/slices/businessSlice';

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
  navbarWidthDeskTop?: string;
  authFormButtons?: boolean;
}

const SELECT_PLAN = '/business/select-plan';



const IS_LOGGED_IN_BUTTON = [
  { icon: 'listing' as IconsType, href: '/' },
  { icon: 'saved' as IconsType, href: '/' },
  { icon: 'chat' as IconsType, href: '/' },
  { icon: 'notification' as IconsType, href: '/' },
];
const IS_LOGGED_IN_BUTTON_BLOG = [
  { icon: 'listing-solid-black' as IconsType, href: '/' },
  { icon: 'saved-black' as IconsType, href: '/' },
  { icon: 'chat-solid-black' as IconsType, href: '/' },
  { icon: 'notification-black' as IconsType, href: '/' },
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

const USER_MENU_ITEMS = [
  {
    text: 'Home',
    dropDown: false,
    href: '/',
  },
  {
    text: 'listing',
    dropDown: true,
    href: '/',
  },
  {
    text: 'cities',
    dropDown: true,
    href: '/',
  },
  {
    text: 'blog',
    dropDown: false,
    href: '/',
  },
  {
    text: 'FAQ',
    dropDown: false,
    href: '/',
  },
];

const USER_MENU_EXTENSIONS: { [key: string]: ReactNode } = {
  listing: <ListingUserMenuExtension />,
  // Add other menu extensions here
};
const Navbar = ({ type, navbarWidthDeskTop, authFormButtons = true }: NavbarProps): JSX.Element => {
  const userIsloggedIn = useSelector(
    (state: RootState) => state.business.userIsLoggedIn
  );
  const { data: session } = useSession();
  const pathname = usePathname();

  console.log('userIsloggedIn: ', userIsloggedIn);

  const router = useRouter();
  const [showMobileMenuItems, setShowMobileMenuItems] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [currentUserMenuExtension, setCurrentUserMenuExtension] = useState<string>('');
  const handleAuthRouter = (login: string = 'true'): void => {
    router.push(`/auth/signin-signup?login=${login}`);
  };

  const handleUsermMenuExtension = (menu: string): void => {
    setCurrentUserMenuExtension(menu);
    // setShowUserMenu(true);
  }

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
      className={`z-50 flex h-24 sm:h-32 w-full items-center justify-center ${type === 'business' ? 'bg-[#F8FAFC]' : type === 'community' || type === 'white' ? 'bg-black/10 backdrop-blur-sm' : ''} ${authFormButtons ? 'py-0' : 'py-4'} px-5 sm:px-28 ${showMobileMenuItems ? 'fixed' : ''}`}
    >
      <div
        className={`relative flex w-full ${navbarWidthDeskTop ? navbarWidthDeskTop : 'sm:w-[1488px]'} items-center ${showMobileMenuItems ? 'justify-end' : 'justify-between'}`}
      >
        {/* logo  */}
        {showMobileMenuItems ? (
          ''
        ) : (
          <div className='flex w-full items-center gap-20'>
            <Logo
              icon={
                type === 'community' || type === '' ? (
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
          <div
            className={`hidden ${userIsloggedIn ? 'w-[200px]' : 'w-80'} items-center justify-end gap-5 sm:flex`}
          >
            {type && !userIsloggedIn && (
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
            {type && !userIsloggedIn && (
              <Button asChild className={`w-[200px] text-xs`} variant={variant}>
                <Link
                  href={'/'}
                  className={`flex h-full items-center justify-center gap-2 ${linkClassName} `}
                >
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

        {/* Logged in user in Landing Page  */}
        {userIsloggedIn && type === '' && (
          <div>
            <div className='flex items-center gap-4 text-white'>
              <div className='flex items-center gap-4'>
                {IS_LOGGED_IN_BUTTON.map((link, key) => {
                  return (
                    <Link
                      key={key}
                      href={link.href}
                      className='flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF4D] p-2'
                    >
                      <BaseIcons value={link.icon} />

                    </Link>
                  );
                })}
              </div>
              <BaseIcons value='vertical-line-white' />

              <div
                className='flex items-center gap-1'

              >
                <BaseIcons value='user-logged-in-white' />
                {session?.user.name && (
                  <p className='ml-1 w-[85px] truncate font-semibold capitalize'>
                    {session?.user.name}
                  </p>
                )}
                <button onClick={() => {

                  setCurrentUserMenuExtension('')
                  setShowUserMenu(!showUserMenu)
                }}>
                  <BaseIcons value='arrow-down-white' />
                </button>
              </div>
            </div>

            {/* user menu  */}

            {showUserMenu && (
              <div className='absolute -right-20 top-20 z-20 flex w-[300px] flex-col gap-4 rounded-lg bg-white font-inter text-black shadow-md'>
                <div className='mb-3 rounded-tl-lg rounded-tr-lg bg-[#F8FAFC] px-5 py-6'>
                  <Link
                    href={'/business/get-started'}
                    className='flex h-14 w-[180px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white'
                  >
                    <span> List business</span>
                    <BaseIcons value='arrow-diagonal-white' />
                  </Link>
                </div>
                <div className='flex flex-col gap-6 px-5 pb-5'>
                  {USER_MENU_ITEMS.map((menu, key) => {
                    return menu.dropDown ? (
                      <button key={key} className='flex items-center gap-2' onClick={() => handleUsermMenuExtension(menu.text)}>
                        <span>{menu.text} </span>{' '}
                        {menu.dropDown && (
                          <BaseIcons value='arrow-down-black' />
                        )}
                      </button>
                    ) : (
                      <Link
                        key={key}
                        href={menu.href}
                        className='flex items-center gap-2'
                      >
                        <span className='capitalize'>{menu.text}</span>
                      </Link>
                    );
                  })}

                  <Link
                    href={'/'}
                    className='text-md -mt-4 flex items-center gap-1 py-3'
                  >
                    <BaseIcons value='logout-black' />
                    <span> Profile settings</span>
                  </Link>

                  <Button
                    variant='neutral'
                    className='text-md flex items-center -mt-2 gap-1 py-3'
                  >
                    <BaseIcons value='logout-black' />
                    <span> Logout</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {userIsloggedIn && type === 'blog' && (
          <div>
            <div className='flex items-center gap-4 text-white'>
              <div className='flex items-center gap-4'>
                {IS_LOGGED_IN_BUTTON_BLOG.map((link, key) => {
                  return (
                    <Link
                      key={key}
                      href={link.href}
                      className='flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFC] p-2'
                    >
                      <BaseIcons value={link.icon} />

                    </Link>
                  );
                })}
              </div>
              <BaseIcons value='vertical-line-white' />

              <div
                className='flex items-center gap-1'

              >
                <BaseIcons value='user-logged-in-black' />
                {session?.user.name && (
                  <p className='ml-1 w-[85px] truncate text-black font-semibold capitalize'>
                    {session?.user.name}
                  </p>
                )}
                <button onClick={() => {

                  setCurrentUserMenuExtension('')
                  setShowUserMenu(!showUserMenu)
                }}>
                  <BaseIcons value='arrow-down-black' />
                </button>
              </div>
            </div>

            {/* user menu  */}

            {showUserMenu && (
              <div className='absolute -right-20 top-20 z-20 flex w-[300px] flex-col gap-4 rounded-lg bg-white font-inter text-black shadow-md'>
                <div className='mb-3 rounded-tl-lg rounded-tr-lg bg-[#F8FAFC] px-5 py-6'>
                  <Link
                    href={'/business/get-started'}
                    className='flex h-14 w-[180px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white'
                  >
                    <span> List business</span>
                    <BaseIcons value='arrow-diagonal-white' />
                  </Link>
                </div>
                <div className='flex flex-col gap-6 px-5 pb-5'>
                  {USER_MENU_ITEMS.map((menu, key) => {
                    return menu.dropDown ? (
                      <button key={key} className='flex items-center gap-2' onClick={() => handleUsermMenuExtension(menu.text)}>
                        <span>{menu.text} </span>{' '}
                        {menu.dropDown && (
                          <BaseIcons value='arrow-down-black' />
                        )}
                      </button>
                    ) : (
                      <Link
                        key={key}
                        href={menu.href}
                        className='flex items-center gap-2'
                      >
                        <span className='capitalize'>{menu.text}</span>
                      </Link>
                    );
                  })}

                  <Link
                    href={'/'}
                    className='text-md -mt-4 flex items-center gap-1 py-3'
                  >
                    <BaseIcons value='logout-black' />
                    <span> Profile settings</span>
                  </Link>

                  <Button
                    variant='neutral'
                    className='text-md flex items-center -mt-2 gap-1 py-3'
                  >
                    <BaseIcons value='logout-black' />
                    <span> Logout</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {USER_MENU_EXTENSIONS[currentUserMenuExtension] && showUserMenu && (
          <div className="absolute top-14 left-[10%] z-20 bg-white py-6 px-8 shadow-lg rounded-lg">
            <p className='mb-1'> Discover a world of businesses and services acrosslifestyle,ellness, fashion, food, tech, and more.</p>
            <div className='border-b-primary border-b-[1px] w-[136px]'>
              <Link href={'/explore'} className="text-primary flex items-center gap-1">
                <p>Explore all cities</p>
                <span className="inline-block -rotate-45">
                  <BaseIcons value="arrow-diagonal-right-primary" />
                </span>

              </Link>
            </div>
            {USER_MENU_EXTENSIONS[currentUserMenuExtension]}
          </div>
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
