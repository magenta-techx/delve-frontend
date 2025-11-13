"use client"

import { Menu} from "lucide-react"
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { BusinessSwitcher } from "./BusinessSwitcher"
import { navItems, supportItems } from "./sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/app/(clients)/misc/api/user"

interface TopNavProps {
  onNotificationsClick?: () => void
}

export function TopNav({  }: TopNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: userResponse, isLoading } = useCurrentUser()
  const user = userResponse?.data

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BusinessSwitcher />
        </div>

        {/* Right side - Menu button */}
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              {/* User Section */}
              {!isLoading && user && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mt-6">
                  <Avatar className="h-12 w-12">
                    {user.profile_image ? (
                      <AvatarImage src={user.profile_image} alt={`${user.first_name} ${user.last_name}`} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                      {getUserInitials(user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}
              
              <nav className="flex flex-col gap-2 mt-6">
                <div className="text-xs font-semibold uppercase opacity-50 mb-2">
                  Overview
                </div>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const IconSelected = item.iconSelected;
                  const isActive =
                    pathname === item.href ||
                    (!item.exact &&
                      item.href !== '/business' &&
                      pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'relative flex items-center gap-3 px-4 py-3 text-sm transition-colors font-inter rounded-lg',
                        isActive
                          ? 'text-[#5F2EEA] font-semibold bg-[#FBFAFF]'
                          : 'text-[#4B5565] hover:bg-[#fbfaffcb]'
                      )}
                    >
                      {isActive ? (
                        <IconSelected className='h-5 w-5' />
                      ) : (
                        <Icon className='h-5 w-5' />
                      )}
                      {item.name}
                      
                      {isActive && (
                        <div className='absolute h-[60%] -translate-y-1/2 top-1/2 right-0 w-1 rounded-l-xl bg-primary'></div>
                      )}
                    </Link>
                  );
                })}

                {/* Support section */}
                <div className="text-xs font-semibold uppercase opacity-50 mt-6 mb-2">
                  Support
                </div>
                {supportItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#FBFAFF] text-[#5F2EEA]'
                          : 'text-[#4B5565] hover:bg-[#fbfaffcb]'
                      )}
                    >
                      <Icon className='h-5 w-5' />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
