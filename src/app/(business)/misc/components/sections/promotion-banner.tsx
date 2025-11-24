"use client"

import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"

export function PromotionBanner() {
  return (
    <div className="bg-yellow-100 rounded-lg p-6 border border-yellow-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">🚀 Promote Your Business</h3>
          <p className="text-sm text-foreground">Reach more customers with ads and featured spots on Delve.</p>
        </div>
      </div>
      <Button className="mt-4 bg-sidebar-primary text-sidebar-primary-foreground gap-2">
        Promote
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
