"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { StatCard, PerformanceChart, PerformanceMetrics } from "@/app/(business)/misc/components";
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useBusinessPerformance } from '@/app/(clients)/misc/api';

type TimePeriod = "this_month" | "last_6_months" | "last_12_months" | "all_time"
type MetricType = "conversations" | "reviews" | "profile_visits" | "saved_by_users"

export default function PerformancePage() {
  const { currentBusiness } = useBusinessContext();
  const business_id = currentBusiness?.id;
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("this_month");
  const [analyticsType, setAnalyticsType] = useState<MetricType>("conversations");

  // Fetch performance data using hook
  const fetchOptions = {
    business_id,
    filter: timePeriod,
    metric: analyticsType,
  };
  const { data, isLoading } = useBusinessPerformance(fetchOptions);

  // Map analyticsType to card colors
  const analyticsMeta = {
    conversations: { color: "text-purple-500", fillColor: "#a855f7", label: "Conversations", subtitle: "Total Message request", actionLabel: "12 Unanswered request" },
    reviews: { color: "text-orange-500", fillColor: "#f97316", label: "Feedback", subtitle: "Total Client Reviews", actionLabel: "6 New reviews" },
    profile_visits: { color: "text-yellow-500", fillColor: "#eab308", label: "Potential clients", subtitle: "Total Business Profile Views", actionLabel: "29 New Profile view" },
    saved_by_users: { color: "text-green-500", fillColor: "#22c55e", label: "Saved by Users", subtitle: "Total Business Profile Saved", actionLabel: "14 New profile save" },
  };

  // Get totals and currents from API
  const totals = data?.totals || {};
  const currents = data?.currents || {};
  const graph = data?.graph || [];

  // Chart data for selected metric
  const chartData = useMemo(() => {
    if (graph.length > 0) {
      return graph.map((point: any) => ({ date: point.x, value: point.y }));
    }
    return [];
  }, [graph]);

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
            value={totals.conversations}
            label={analyticsMeta.conversations.label}
            subtitle={analyticsMeta.conversations.subtitle}
            actionLabel={analyticsMeta.conversations.actionLabel}
            color="purple"
          />
          <StatCard
            icon="🔥"
            value={totals.reviews}
            label={analyticsMeta.reviews.label}
            subtitle={analyticsMeta.reviews.subtitle}
            actionLabel={analyticsMeta.reviews.actionLabel}
            color="orange"
          />
          <StatCard
            icon="⭐"
            value={totals.profile_visits}
            label={analyticsMeta.profile_visits.label}
            subtitle={analyticsMeta.profile_visits.subtitle}
            actionLabel={analyticsMeta.profile_visits.actionLabel}
            color="yellow"
          />
          <StatCard
            icon="🔖"
            value={totals.saved_by_users}
            label={analyticsMeta.saved_by_users.label}
            subtitle={analyticsMeta.saved_by_users.subtitle}
            actionLabel={analyticsMeta.saved_by_users.actionLabel}
            color="green"
          />
        </div>
      </div>

      {/* Time period filters */}
      <div className="flex gap-2">
        <Button
          variant={timePeriod === "this_month" ? "default" : "outline"}
          onClick={() => setTimePeriod("this_month")}
          className="rounded-full"
        >
          This Month
        </Button>
        <Button
          variant={timePeriod === "last_6_months" ? "default" : "outline"}
          onClick={() => setTimePeriod("last_6_months")}
          className="rounded-full"
        >
          Last 6 Months
        </Button>
        <Button
          variant={timePeriod === "last_12_months" ? "default" : "outline"}
          onClick={() => setTimePeriod("last_12_months")}
          className="rounded-full"
        >
          Last 12 Months
        </Button>
        <Button
          variant={timePeriod === "all_time" ? "default" : "outline"}
          onClick={() => setTimePeriod("all_time")}
          className="rounded-full"
        >
          All Time
        </Button>
      </div>

      {/* Analytics type selector */}
      <div className="flex gap-2 flex-wrap">
        {(["conversations", "reviews", "profile_visits", "saved_by_users"] as const).map((type) => (
          <Button
            key={type}
            variant={analyticsType === type ? "default" : "outline"}
            onClick={() => setAnalyticsType(type)}
            size="sm"
          >
            {analyticsMeta[type].label}
          </Button>
        ))}
      </div>

      {/* Main analytics card */}
      <Card>
        <CardHeader>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${analyticsMeta[analyticsType].color}`}>{totals[analyticsType]}</span>
                <span className="text-sm text-green-600 font-medium">
                  {timePeriod === "this_month" ? "This month" : timePeriod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <CardTitle className="mt-2">
                {analyticsMeta[analyticsType].label} Analytics
              </CardTitle>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Recent</div>
              <div className={`text-xl font-semibold ${analyticsMeta[analyticsType].color}`}>
                {currents[analyticsType]} New
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PerformanceChart data={chartData} strokeColor={analyticsMeta[analyticsType].fillColor} />
        </CardContent>
      </Card>

      {/* Performance metrics cards */}
      <PerformanceMetrics analyticsType={analyticsType} />
    </div>
  )
}
