"use client"

import { Menu} from "lucide-react"
import { Button, Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger, } from "@/components/ui"
import { useState } from "react"
import { BusinessSwitcher } from "./BusinessSwitcher"
import { navItems, supportItems } from "./sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface TopNavProps {
  onNotificationsClick?: () => void
}

export function NavbarTop({  }: TopNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

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
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
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
