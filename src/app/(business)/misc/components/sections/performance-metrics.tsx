"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui"
import { AlertCircle } from "lucide-react"

interface PerformanceMetricsProps {
  analyticsType?:"conversations" | "reviews" | "profile_visits" | "saved_by_users"
}

export function PerformanceMetrics({ analyticsType = "conversations" }: PerformanceMetricsProps) {
  const metricsConfig = {
    all: {
      cards: [
        { title: "Total Engagement", value: "4,250", subtitle: "This month", bgColor: "bg-purple-50", icon: "📊" },
        { title: "Avg. Response Time", value: "2.5h", subtitle: "This month", bgColor: "bg-blue-50", icon: "⏱️" },
        { title: "Growth Rate", value: "+12%", subtitle: "vs last month", bgColor: "bg-green-50", icon: "📈" },
      ],
    },
    conversations: {
      cards: [
        {
          title: "Response Rate",
          value: "85%",
          subtitle: "This month",
          bgColor: "bg-purple-50",
          icon: "✓",
        },
        {
          title: "Avg. Response Time",
          value: "2.5h",
          subtitle: "This month",
          bgColor: "bg-blue-50",
          icon: "⏱️",
        },
        {
          title: "Customer Satisfaction",
          value: "4.8/5",
          subtitle: "Average rating",
          bgColor: "bg-yellow-50",
          icon: "⭐",
        },
      ],
    },
    reviews: {
      cards: [
        { title: "Avg. Rating", value: "4.6/5", subtitle: "This month", bgColor: "bg-orange-50", icon: "⭐" },
        { title: "Positive Reviews", value: "89%", subtitle: "This month", bgColor: "bg-green-50", icon: "👍" },
        { title: "Response Rate", value: "95%", subtitle: "to reviews", bgColor: "bg-purple-50", icon: "✓" },
      ],
    },
    "profile-views": {
      cards: [
        {
          title: "Avg. Session Duration",
          value: "3.2m",
          subtitle: "This month",
          bgColor: "bg-yellow-50",
          icon: "⏱️",
        },
        { title: "Bounce Rate", value: "12%", subtitle: "This month", bgColor: "bg-red-50", icon: "↩️" },
        { title: "Return Visits", value: "42%", subtitle: "This month", bgColor: "bg-blue-50", icon: "🔄" },
      ],
    },
    saved: {
      cards: [
        { title: "Save Rate", value: "15%", subtitle: "of views", bgColor: "bg-green-50", icon: "🔖" },
        { title: "Resave Rate", value: "28%", subtitle: "of saved items", bgColor: "bg-blue-50", icon: "🔄" },
        { title: "List Conversion", value: "8%", subtitle: "to contacts", bgColor: "bg-purple-50", icon: "✓" },
      ],
    },
  }

  const metrics = metricsConfig[analyticsType] || metricsConfig.all
  const barData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 30 },
    { day: "Wed", value: 35 },
    { day: "Thu", value: 50 },
    { day: "Fri", value: 45 },
    { day: "Sat", value: 40 },
    { day: "Sun", value: 35 },
  ]

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.cards.map((card, idx) => (
          <Card key={idx} className={card.bgColor}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                </div>
                <span className="text-2xl">{card.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly performance chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Weekly Performance</CardTitle>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status message */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Your analytics are performing well with engagement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
