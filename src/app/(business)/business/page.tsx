"use client"

import { useBusinessContext } from "@/contexts/BusinessContext"
import { ConversationsSection } from "../misc/components/sections/conversations-section"
import { ReviewsSection } from "../misc/components/sections/reviews-section"


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
          </div>
        </div>
      </div>
    </div>
  )
}
