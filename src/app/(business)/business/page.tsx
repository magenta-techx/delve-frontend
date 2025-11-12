"use client"

import { useBusinessContext } from "@/contexts/BusinessContext"
import { ConversationsSection } from "../misc/components/sections/conversations-section"
import { GalleryWidget } from "../misc/components/sections/gallery-widget"
import { PerformanceMetrics } from "../misc/components/sections/performance-metrics"
import { ReviewsSection } from "../misc/components/sections/reviews-section"
import { StatCard } from "../misc/components/stat-card"


export default function DashboardPage(): JSX.Element {
  const { currentBusiness, isLoading } = useBusinessContext()

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!currentBusiness) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-600 mb-4">No business selected</p>
            <a
              href="/business/get-started"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Your First Business
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back to {currentBusiness.name}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="💬"
            value={68}
            label="Conversations"
            sublabel="Total Message request"
            metric={{ label: "Unanswered request", value: "12", color: "#6366F1" }}
          />
          <StatCard
            icon="🔥"
            value={36}
            label="Feedback"
            sublabel="Total Client Reviews"
            metric={{ label: "New reviews", value: "6", color: "#FF6B35" }}
          />
          <StatCard
            icon="🎯"
            value={147}
            label="Potential clients"
            sublabel="Total Business Profile Views"
            metric={{ label: "New Profile view", value: "29", color: "#FFB84D" }}
          />
          <StatCard
            icon="📌"
            value={89}
            label="Saved by Users"
            sublabel="Total Business Profile Saved"
            metric={{ label: "New profile save", value: "14", color: "#00B894" }}
          />
        </div>

        <GalleryWidget />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Performance chart and conversations */}
          <div className="lg:col-span-2 space-y-6">
            {/* <PerformanceChart /> */}
            <ConversationsSection />
          </div>

          {/* Right side - Reviews and metrics */}
          <div className="space-y-6">
            <ReviewsSection />
            <PerformanceMetrics />
          </div>
        </div>
      </div>
    </div>
  )
}
