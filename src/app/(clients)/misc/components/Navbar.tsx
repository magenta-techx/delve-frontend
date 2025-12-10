'use client';

import React, { useMemo } from 'react';
import { Logo } from '@/assets/icons';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  ChatsIcon,
  ListingsIcon,
  NotificationsIcon,
  SavedBusinessesIcon,
} from '../icons';
import Link from 'next/link';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { LinkButton } from '@/components/ui';
import { CaretDown } from '@/assets/icons';
import { getInitials } from '@/utils/strings';
import { useBusinessCategories, useBusinessStates } from '../api/metadata';
import {
  BusinessCategoryIcons,
  BusinessCategoriesIconsType as CategoryIconType,
} from '@/assets/icons/business/BusinessCategoriesIcon';

const LandingPageNavbar = () => {
  const { data: session, status } = useSession();
  const hasValidAccessToken = Boolean(
    session?.user?.accessToken && String(session.user.accessToken).length > 0
  );
  const userIsloggedIn =
    status === 'authenticated' && Boolean(session?.user) && hasValidAccessToken;

  const { data: categoriesData } = useBusinessCategories();
  const { data: statesData } = useBusinessStates();

  const categories = categoriesData?.data || [];
  const states = statesData?.data || [];

  const popularCities = ['Lagos', 'Abuja', 'Oyo', 'Rivers', 'Edo'];
  const popularStates = states.filter(state =>
    popularCities.includes(state.name)
  );
  const otherStates = states.filter(
    state => !popularCities.includes(state.name)
  );

  const pathname = usePathname();
  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();
  const isBusiness =
    pathname == '/businesses' || pathname == '/businesses/get-started';

  const VISITORS_LINKS = [
    { name: 'Home', href: '/', hasBlackBg: true },
    { name: 'Listings', href: '/businesses/search', hasBlackBg: true },
    { name: 'FAQs', href: '/#faqs', hasBlackBg: false },
    { name: 'Cities', href: '/businesses/search', hasBlackBg: true },
    { name: 'Blog', href: '/blog', hasBlackBg: false },
  ];

  const AUTHENTICATED_USER_LINKS = [
    {
      name: 'Listings',
      href: '/businesses/explore',
      hasBlackBg: false,
      icon: ListingsIcon,
    },
    {
      name: 'Saved Businesses',
      href: '/businesses/saved',
      hasBlackBg: false,
      icon: SavedBusinessesIcon,
    },
    {
      name: 'Chats',
      href: '/chats',
      hasBlackBg: false,
      icon: ChatsIcon,
    },
    {
      name: 'Notifications',
      href: '/notifications',
      hasBlackBg: false,
      icon: NotificationsIcon,
    },
  ];
  const BUSINESS_LANDING_NAVLINKS = [
    {
      name: 'Business Type',
      href: '/businesses#type',
      hasBlackBg: false,
      icon: ListingsIcon,
    },
    {
      name: 'Pricing',
      href: '/businesses#pricing',
      hasBlackBg: false,
      icon: SavedBusinessesIcon,
    },
  ];

  const OTHER_PAGES_WITH_BLACKBG = ['/businesses/get-started'];

  const pageHasBlackBg = useMemo(() => {
    if (userIsloggedIn) {
      return (
        AUTHENTICATED_USER_LINKS.some(
          link => link.href === pathname && link.hasBlackBg
        ) ||
        OTHER_PAGES_WITH_BLACKBG.includes(pathname) ||
        (!isMobile && pathname == '/')
      );
    }
    return (
      VISITORS_LINKS.some(link => link.href === pathname && link.hasBlackBg) ||
      OTHER_PAGES_WITH_BLACKBG.includes(pathname)
    );
  }, [pathname, userIsloggedIn, isMobile]);

  const PAGES_WITHOUT_NAVBAR = [
    '/signup',
    '/login',
    '/businesses/create-listing',
  ];

  if (PAGES_WITHOUT_NAVBAR.includes(pathname)) {
    return null;
  }

  return (
    <nav
      className={cn(
        'relative z-[20] flex h-16 w-full items-center justify-between px-4 md:px-16 md:backdrop-blur-lg lg:h-20 lg:px-24',

        pageHasBlackBg
          ? 'bg-[#0D121C2E]'
          : isBusiness || isMobile
            ? 'bg-white'
            : 'bg-white'
      )}
    >
      <div className='container mx-auto flex flex-row items-center justify-between'>
        <section className='flex items-center gap-16'>
          <Logo
            className='w-24 max-sm:w-20'
            textColor={
              pageHasBlackBg
                ? 'white'
                : isBusiness || isMobile
                  ? 'black'
                  : 'black'
            }
          />
          {isBusiness && !isMobile && (
            <ul>
              {BUSINESS_LANDING_NAVLINKS.map(link => (
                <li key={link.name} className='mr-8 inline-block'>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-md font-medium',
                      pageHasBlackBg ? 'text-white' : 'text-black'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isBusiness ? (
          <section>
            {!userIsloggedIn && (
              <LinkButton
                size='dynamic_xl'
                variant={isMobile ? 'default' : 'ghost'}
                href='/signin'
                className={cn('mr-2', pageHasBlackBg && 'text-white')}
              >
                Log in / Sign up
              </LinkButton>
            )}
            <LinkButton
              size='dynamic_xl'
              href='/'
              className='max-md:!hidden'
              variant={'black'}
            >
              Market Place
              <svg
                width='21'
                height='21'
                viewBox='0 0 21 21'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clipRule='evenodd'
                  d='M11.1933 0.0956677C10.4279 -0.0318892 9.64676 -0.0318892 8.88142 0.0956677L6.84769 0.434622H5.4598C4.89426 0.434622 4.34137 0.602023 3.87081 0.915729L2.04569 2.13247C1.36759 2.58455 0.91414 3.30405 0.798885 4.11084L0.0230325 9.5418C-0.101448 10.4132 0.285489 11.2786 1.01787 11.7668C1.18431 11.8778 1.36195 11.9648 1.54598 12.0278L2.05769 16.3773C2.35085 18.8692 4.4627 20.7471 6.97172 20.7471H13.6238C16.1328 20.7471 18.2447 18.8692 18.5378 16.3773L19.0823 11.7496C19.7981 11.2584 20.1747 10.403 20.0517 9.5418L19.2758 4.11084C19.1606 3.30405 18.7071 2.58455 18.029 2.13247L16.2039 0.915728C15.7333 0.602023 15.1804 0.434622 14.6149 0.434622H13.227L11.1933 0.0956677ZM4.73753 2.21581C4.95142 2.07321 5.20273 1.99712 5.4598 1.99712H6.02736L5.14391 9.0647L2.64451 10.4929C2.40669 10.6288 2.11249 10.6187 1.88458 10.4668C1.65287 10.3123 1.53044 10.0385 1.56983 9.76277L2.34568 4.33181C2.39807 3.96509 2.60418 3.63804 2.91241 3.43255L4.73753 2.21581ZM3.41973 11.8496L5.89527 10.435L6.89288 10.9338C8.87237 11.9235 11.2023 11.9235 13.1818 10.9338L14.1794 10.435L16.655 11.8496C16.9094 11.995 17.1843 12.0875 17.4645 12.1276L16.986 16.1948C16.7855 17.8997 15.3405 19.1846 13.6238 19.1846H12.9019V16.8409C12.9019 15.2588 11.6194 13.9763 10.0373 13.9763C8.45528 13.9763 7.17276 15.2588 7.17276 16.8409V19.1846H6.97172C5.25502 19.1846 3.81007 17.8997 3.60949 16.1948L3.11539 11.9949C3.21932 11.9544 3.32106 11.9059 3.41973 11.8496ZM17.4302 10.4929L14.9308 9.06469L14.0473 1.99712H14.6149C14.872 1.99712 15.1233 2.07321 15.3372 2.21581L17.1623 3.43255C17.4705 3.63804 17.6766 3.96509 17.729 4.33181L18.5049 9.76277C18.5442 10.0385 18.4218 10.3123 18.1901 10.4668C17.9622 10.6187 17.668 10.6288 17.4302 10.4929ZM10.9364 1.63691L12.4594 1.89074L13.3602 9.09763L12.483 9.53623C10.9434 10.306 9.13125 10.306 7.59165 9.53623L6.71446 9.09763L7.61532 1.89074L9.13829 1.63691C9.73356 1.5377 10.3411 1.5377 10.9364 1.63691ZM10.0373 15.5388C10.7565 15.5388 11.3394 16.1218 11.3394 16.8409V19.1846H8.73526V16.8409C8.73526 16.1218 9.31823 15.5388 10.0373 15.5388Z'
                  fill='white'
                />
              </svg>
            </LinkButton>
          </section>
        ) : (
          <>
            {calculatingScreenWidth ? null : (
              <>
                {!isMobile && (
                  <ul
                    className={cn(
                      'flex items-center gap-4',
                      userIsloggedIn ? 'ml-auto' : 'mx-auto'
                    )}
                  >
                    {userIsloggedIn
                      ? AUTHENTICATED_USER_LINKS.map(link => {
                          const isActive =
                            pathname === link.href ||
                            pathname.startsWith(link.href + '/');

                          return (
                            <li key={link.name} className=''>
                              <Link
                                href={link.href}
                                className={cn(
                                  'flex size-[2.75rem] items-center justify-center rounded-full',
                                  isActive
                                    ? 'bg-[#ECE9FE]'
                                    : pageHasBlackBg
                                      ? 'bg-[#FFFFFF4D]'
                                      : 'bg-[#F8FAFC]',
                                  isActive
                                    ? 'text-primary-600'
                                    : pageHasBlackBg
                                      ? 'hover:text-primary-400 text-white'
                                      : 'hover:text-primary-600 text-black'
                                )}
                              >
                                <link.icon className='' />
                                <span className='sr-only'>{link.name}</span>
                              </Link>
                            </li>
                          );
                        })
                      : VISITORS_LINKS.map(link => {
                          // Listings and Cities get dropdown menus
                          if (link.name === 'Listings') {
                            return (
                              <li key={link.name}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className={cn(
                                        'flex items-center gap-1 px-4',
                                        pageHasBlackBg
                                          ? 'text-white'
                                          : 'text-black'
                                      )}
                                    >
                                      {link.name}
                                      <CaretDown className='h-3 w-3' />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className='max-h-[500px] w-[880px] overflow-y-auto p-8'
                                    align='start'
                                  >
                                    <div className='mb-4'>
                                      <p className='mb-2 text-sm text-gray-600'>
                                        Discover a world of businesses and
                                        services across lifestyle, wellness,
                                        fashion, food, tech, and more
                                      </p>
                                      <Link
                                        href='/businesses/search'
                                        className='text-primary-600 flex items-center gap-1 text-sm hover:underline'
                                      >
                                        Explore all category →
                                      </Link>
                                    </div>

                                    <h3 className='mb-6 text-2xl font-bold'>
                                      Browse Category
                                    </h3>

                                    <div className='grid grid-cols-4 gap-6'>
                                      {categories.map(category => {
                                        const iconName = category.name
                                          ?.split(' ')[0]
                                          ?.toLowerCase() as CategoryIconType;

                                        return (
                                          <Link
                                            key={category.id}
                                            href={`/businesses/search?category=${encodeURIComponent(category.name)}`}
                                            className='group flex items-start gap-2.5 hover:!text-primary'
                                          >
                                            <BusinessCategoryIcons
                                              className='text-primary-600 group-hover:!fill-primary-600 group-hover:!stroke-primary-600 size-5 !shrink-0 group-hover:!text-primary'
                                              value={iconName}
                                            />
                                            <div className='group-hover:!fill-primary-600 group-hover:!stroke-primary-600 mb-2 group-hover:!text-primary'>
                                              <h4 className='mb-1 flex items-center gap-2 text-sm font-semibold capitalize group-hover:!text-primary'>
                                                {category.name}
                                              </h4>
                                              {category.subcategories &&
                                                category.subcategories.length >
                                                  0 && (
                                                  <p className='text-[0.7rem] text-gray-600 group-hover:!text-primary'>
                                                    {category.subcategories
                                                      .slice(0, 3)
                                                      .map(sub => sub.name)
                                                      .join(', ')}
                                                    {category.subcategories
                                                      .length > 3 && '...'}
                                                  </p>
                                                )}
                                            </div>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </li>
                            );
                          }

                          if (link.name === 'Cities') {
                            return (
                              <li key={link.name}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className={cn(
                                        'flex items-center gap-1 px-4',
                                        pageHasBlackBg
                                          ? 'text-white'
                                          : 'text-black'
                                      )}
                                    >
                                      {link.name}
                                      <CaretDown className='h-3 w-3' />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className='w-[880px] p-8'
                                    align='start'
                                  >
                                    <div className='mb-4'>
                                      <p className='mb-2 text-sm text-gray-600'>
                                        Discover a world of businesses and
                                        services across lifestyle, wellness,
                                        fashion, food, tech, and more
                                      </p>
                                      <Link
                                        href='/businesses/search'
                                        className='text-primary-600 flex items-center gap-1 text-sm hover:underline'
                                      >
                                        Explore all Cities →
                                      </Link>
                                    </div>

                                    <h3 className='mb-6 text-2xl font-bold'>
                                      Browse by City
                                    </h3>

                                    <div className='mb-6'>
                                      <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                                        <span>🔥</span> Popular
                                      </h4>
                                      <div className='flex flex-wrap gap-3'>
                                        {popularStates.map(state => (
                                          <Link
                                            key={state.name}
                                            href={`/businesses/search?state=${encodeURIComponent(state.name)}`}
                                            className='rounded-full bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800'
                                          >
                                            {state.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className='mb-4 text-base font-bold'>
                                        Others
                                      </h4>
                                      <div className='flex flex-wrap gap-3'>
                                        {otherStates.map(state => (
                                          <Link
                                            key={state.name}
                                            href={`/businesses/search?state=${encodeURIComponent(state.name)}`}
                                            className='rounded-full bg-gray-100 px-6 py-2 text-black transition-colors hover:bg-gray-200'
                                          >
                                            {state.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </li>
                            );
                          }

                          // Regular links (Home, Explore, Blog, FAQs)
                          return (
                            <li
                              key={link.name}
                              className={cn(
                                'px-4',
                                pageHasBlackBg ? 'text-white' : ''
                              )}
                            >
                              <Link href={link.href}>{link.name}</Link>
                            </li>
                          );
                        })}
                  </ul>
                )}

                {userIsloggedIn && (
                  <div
                    className={cn(
                      'mx-2 hidden h-6 w-0.5 md:block',
                      pageHasBlackBg ? 'bg-[#9AA4B2]' : 'bg-gray-300'
                    )}
                  />
                )}
                {userIsloggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'flex !cursor-pointer items-center gap-1 rounded-full',
                          isMobile ? '' : 'px-2 py-1',
                          !isMobile && pageHasBlackBg
                            ? 'text-white hover:bg-white/20'
                            : 'text-black hover:bg-gray-200'
                        )}
                      >
                        {isMobile ? (
                          <span className='flex size-8 items-center justify-center rounded-full bg-purple-800 text-base font-semibold text-white'>
                            {getInitials(session?.user.name || 'US')}
                          </span>
                        ) : (
                          <>
                            {session?.user.name && (
                              <p className='ml-1 w-max max-w-36 truncate text-left font-semibold capitalize'>
                                {session?.user.name}
                              </p>
                            )}
                          </>
                        )}
                        {/* <BaseIcons value='user-logged-in-white' /> */}
                        <CaretDown className='max-md:size-5' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-72'>
                      <div className='flex w-full items-center justify-center bg-[#F8FAFC] px-8 py-5'>
                        {session.user.is_brand_owner ? (
                          <LinkButton
                            href='/business'
                            className='w-full bg-[#551FB9]'
                            size={'dynamic_lg'}
                          >
                            Business Dashboard
                          </LinkButton>
                        ) : (
                          <LinkButton
                            href='/businesses'
                            className='w-full bg-[#551FB9]'
                            size={'dynamic_lg'}
                          >
                            List your business
                          </LinkButton>
                        )}
                      </div>

                      {VISITORS_LINKS.map((link, key) => (
                        <DropdownMenuItem key={key} className='!p-0'>
                          <Link
                            key={key}
                            href={link.href}
                            className='block h-full w-full px-4 py-4 text-sm hover:bg-gray-100'
                          >
                            {link.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}

                      <div className='mt-2 p-6'>
                        <Button
                          variant='light'
                          size='lg'
                          className='w-full'
                          onClick={() => signOut({ callbackUrl: '/' })}
                        >
                          Logout
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <section>
                    <LinkButton
                      size='lg'
                      variant={isMobile ? 'default' : 'ghost'}
                      href='/signin'
                      className={cn('mr-2', pageHasBlackBg && 'text-white')}
                    >
                      Log in / Sign up
                    </LinkButton>
                    <LinkButton
                      size='lg'
                      href='/businesses'
                      className='max-md:!hidden'
                    >
                      List your business
                    </LinkButton>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default LandingPageNavbar;
