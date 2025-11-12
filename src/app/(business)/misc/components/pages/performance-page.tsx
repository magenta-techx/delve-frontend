"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PerformanceChart } from "@/components/business/charts/performance-chart"
import { PerformanceMetrics } from "@/components/business/sections/performance-metrics"
import { StatCard } from "@/components/business/stat-card"

type TimePeriod = "this-month" | "last-6-months" | "last-12-months" | "all-time"

export function PerformancePage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("this-month")
  const [analyticsType, setAnalyticsType] = useState<"all" | "conversations" | "reviews" | "profile-views" | "saved">(
    "all",
  )

  // Mock data for different analytics types
  const analyticsData = {
    all: { value: 338, subtitle: "This month", color: "text-blue-500", fillColor: "#3b82f6" },
    conversations: { value: 68, subtitle: "This month", color: "text-purple-500", fillColor: "#a855f7" },
    reviews: { value: 36, subtitle: "This month", color: "text-orange-500", fillColor: "#f97316" },
    "profile-views": { value: 147, subtitle: "This month", color: "text-yellow-500", fillColor: "#eab308" },
    saved: { value: 89, subtitle: "This month", color: "text-green-500", fillColor: "#22c55e" },
  }

  const currentData = analyticsData[analyticsType]

  // Mock chart data
  const getChartData = () => {
    const baseData = [
      { date: "2 Jul", value: 10 },
      { date: "4 Jul", value: 15 },
      { date: "6 Jul", value: 12 },
      { date: "8 Jul", value: 18 },
      { date: "10 Jul", value: 22 },
      { date: "12 Jul", value: 25 },
      { date: "14 Jul", value: 28 },
      { date: "16 Jul", value: 32 },
      { date: "18 Jul", value: 38 },
      { date: "20 Jul", value: 42 },
      { date: "22 Jul", value: 45 },
      { date: "24 Jul", value: 48 },
      { date: "26 Jul", value: 50 },
      { date: "26 Jul", value: 52 },
      { date: "28 Jul", value: 48 },
      { date: "30 Jul", value: 42 },
    ]
    return baseData
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and stat cards */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-muted-foreground mb-4">Track your business performance metrics in real time</p>

        {/* Stat cards row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            icon="💬"
            value="68"
            label="Conversations"
            subtitle="Total Message request"
            actionLabel="12 Unanswered request"
            color="purple"
          />
          <StatCard
            icon="🔥"
            value="36"
            label="Feedback"
            subtitle="Total Client Reviews"
            actionLabel="6 New reviews"
            color="orange"
          />
          <StatCard
            icon="⭐"
            value="147"
            label="Potential clients"
            subtitle="Total Business Profile Views"
            actionLabel="29 New Profile view"
            color="yellow"
          />
          <StatCard
            icon="🔖"
            value="89"
            label="Saved by Users"
            subtitle="Total Business Profile Saved"
            actionLabel="14 New profile save"
            color="green"
          />
        </div>
      </div>

      {/* Time period filters */}
      <div className="flex gap-2">
        <Button
          variant={timePeriod === "this-month" ? "default" : "outline"}
          onClick={() => setTimePeriod("this-month")}
          className="rounded-full"
        >
          This Month
        </Button>
        <Button
          variant={timePeriod === "last-6-months" ? "default" : "outline"}
          onClick={() => setTimePeriod("last-6-months")}
          className="rounded-full"
        >
          Last 6 Months
        </Button>
        <Button
          variant={timePeriod === "last-12-months" ? "default" : "outline"}
          onClick={() => setTimePeriod("last-12-months")}
          className="rounded-full"
        >
          Last 12 Months
        </Button>
        <Button
          variant={timePeriod === "all-time" ? "default" : "outline"}
          onClick={() => setTimePeriod("all-time")}
          className="rounded-full"
        >
          All Time
        </Button>
      </div>

      {/* Analytics type selector */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "conversations", "reviews", "profile-views", "saved"] as const).map((type) => (
          <Button
            key={type}
            variant={analyticsType === type ? "default" : "outline"}
            onClick={() => setAnalyticsType(type)}
            size="sm"
          >
            {type === "all" && "All Performance"}
            {type === "conversations" && "Conversation Analytics"}
            {type === "reviews" && "Review Analytics"}
            {type === "profile-views" && "Profile Visit Analytics"}
            {type === "saved" && "Saved Profile Analytics"}
          </Button>
        ))}
      </div>

      {/* Main analytics card */}
      <Card>
        <CardHeader>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${currentData.color}`}>{currentData.value}</span>
                <span className="text-sm text-green-600 font-medium">{currentData.subtitle}</span>
              </div>
              <CardTitle className="mt-2">
                {analyticsType === "all" && "All Performance"}
                {analyticsType === "conversations" && "Conversation Analytics"}
                {analyticsType === "reviews" && "Review Analytics"}
                {analyticsType === "profile-views" && "Profile Visit Analytics"}
                {analyticsType === "saved" && "Saved Profile Analytics"}
              </CardTitle>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">14 Jul</div>
              <div className={`text-xl font-semibold ${currentData.color}`}>
                {analyticsType === "all" && "173 Growth"}
                {analyticsType === "conversations" && "23 New request"}
                {analyticsType === "reviews" && "6 New reviews"}
                {analyticsType === "profile-views" && "54 New visit"}
                {analyticsType === "saved" && "36 New profile save"}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PerformanceChart data={getChartData()} strokeColor={currentData.fillColor} />
        </CardContent>
      </Card>

      {/* Performance metrics cards */}
      <PerformanceMetrics analyticsType={analyticsType} />
    </div>
  )
}
