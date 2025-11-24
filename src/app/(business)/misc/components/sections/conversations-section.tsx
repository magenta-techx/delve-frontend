"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui"
import { MoreHorizontal } from "lucide-react"

export function ConversationsSection() {
  const conversations = [
    {
      id: 1,
      name: "Cravory Kitchen",
      avatar: "🍴",
      message: "Hi, do you deliver to Lekki Phase 1?",
      date: "18 June",
    },
    {
      id: 2,
      name: "Aura",
      avatar: "A",
      message: "Perfect! I'll share our wedding decor packages with you shortly. Can I send t...",
      date: "23 June",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Conversations</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div key={conv.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                {conv.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm">{conv.name}</h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{conv.date}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">{conv.message}</p>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full">
            View all
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
