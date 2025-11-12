"use client"

import { Bell, Settings, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface TopNavProps {
  onNotificationsClick?: () => void
}

export function TopNav({ onNotificationsClick }: TopNavProps) {
  const [timePeriod, setTimePeriod] = useState("This Month")
  const periods = ["This Month", "Last 6 Months", "Last 12 Months", "All Time"]

  return (
    <div className="border-b border-border bg-background">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Time period selector */}
        <div className="hidden md:flex items-center gap-2">
          {periods.map((period) => (
            <Button
              key={period}
              variant={timePeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimePeriod(period)}
              className={timePeriod === period ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""}
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onNotificationsClick}>
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">John Maija</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
