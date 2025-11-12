"use client"

import { Card , CardContent, CardHeader, CardTitle} from "@/components/ui/card"


export function ReviewsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-5xl font-bold">4.6</p>
          <div className="flex justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < 4 ? "⭐" : "☆"}>
                {i < 4 ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">28+ reviews</p>
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
