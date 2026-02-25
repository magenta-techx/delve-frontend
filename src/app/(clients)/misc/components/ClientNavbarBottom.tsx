'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    SettingsIcon,

} from '@/app/(business)/misc/components/icons';
import { ListingsIcon, SavedBusinessesIcon, ChatsIcon, NotificationsIcon } from '../icons';




export function ClientNavbarBottom() {
    const pathname = usePathname();


    const AUTHENTICATED_USER_LINKS = [
        {
            name: 'Listings',
            href: '/businesses/explore',
            hasBlackBg: true,
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
        {
            name: 'Profile Settings',
            href: '/profile',
            hasBlackBg: false,
            icon: SettingsIcon,
        },
    ];
    const mobileItems = AUTHENTICATED_USER_LINKS.slice(0, 5);

    return (
        <>
            <nav className="h-14 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
                <div className="flex items-center justify-around px-4 py-2">
                    {mobileItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0',
                                    isActive
                                        ? 'text-[#5F2EEA]'
                                        : 'text-gray-500 hover:text-gray-700'
                                )}
                            >

                                <Icon className={cn("size-5", isActive && "text-primary")} />

                                <span className="text-[0.65rem] font-medium truncate max-w-full sr-only">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>


        </>
    );
}