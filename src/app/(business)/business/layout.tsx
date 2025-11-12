"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "../misc/components/sidebar"
import { TopNav } from "../misc/components/top-nav"
import { Notifications } from "../misc/components/notifications"
import { BusinessProvider } from "@/contexts/BusinessContext"

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <BusinessProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#FCFCFD]">
          {/* Top Navigation */}
          <TopNav onNotificationsClick={() => setShowNotifications(!showNotifications)} />

          {/* Content area with notifications */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto">{children}</div>

            {/* Notifications panel */}
            {showNotifications && (
              <div className="w-80 border-l border-border bg-background">
                <Notifications />
              </div>
            )}
          </div>
        </div>
      </div>
    </BusinessProvider>
  )
}
