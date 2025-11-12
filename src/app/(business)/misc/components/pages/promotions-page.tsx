"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Pool Party",
    type: "Advert",
    image: "/summer-pool-party-colorful-event.jpg",
    engagements: 456,
    status: "live",
    daysLeft: 3,
  },
  {
    id: 2,
    name: "Elan Moments",
    type: "Promotion",
    image: "/luxury-spa-beauty-salon.jpg",
    engagements: 340,
    status: "live",
    daysLeft: 5,
  },
]

// Mock data for spending chart
const spendingData = [
  { date: "1 Jul", amount: 5000 },
  { date: "2 Jul", amount: 7000 },
  { date: "3 Jul", amount: 8500 },
  { date: "4 Jul", amount: 6500 },
  { date: "5 Jul", amount: 9000 },
  { date: "6 Jul", amount: 7500 },
  { date: "7 Jul", amount: 12000 },
  { date: "8 Jul", amount: 10000 },
  { date: "9 Jul", amount: 11000 },
  { date: "10 Jul", amount: 10500 },
  { date: "11 Jul", amount: 9500 },
  { date: "12 Jul", amount: 11500 },
  { date: "13 Jul", amount: 13000 },
  { date: "14 Jul", amount: 15000 },
  { date: "15 Jul", amount: 14500 },
  { date: "16 Jul", amount: 13000 },
  { date: "17 Jul", amount: 12500 },
  { date: "18 Jul", amount: 14000 },
  { date: "19 Jul", amount: 15500 },
  { date: "20 Jul", amount: 16000 },
]

// Mock data for views chart
const viewsData = [
  { date: "2 Jul", views: 100 },
  { date: "4 Jul", views: 250 },
  { date: "6 Jul", views: 500 },
  { date: "8 Jul", views: 800 },
  { date: "10 Jul", views: 950 },
  { date: "12 Jul", views: 1200 },
  { date: "14 Jul", views: 1500 },
  { date: "16 Jul", views: 1800 },
  { date: "18 Jul", views: 2000 },
  { date: "20 Jul", views: 2340 },
  { date: "22 Jul", views: 2600 },
  { date: "24 Jul", views: 2800 },
  { date: "26 Jul", views: 2900 },
  { date: "28 Jul", views: 3000 },
  { date: "30 Jul", views: 3340 },
]

export function PromotionsPage() {
  const [selectedTab, setSelectedTab] = useState<"advert" | "promotion">("advert")
  const [selectedPeriod, setSelectedPeriod] = useState("7-days")

  const totalSpending = 20000
  const totalViews = 3340

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Promotions and Adverts</h1>
        <p className="text-muted-foreground">
          Choose your campaign duration, set your budget, and track performance in real time.
        </p>
      </div>

      {/* Create Campaign Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Create Campaign</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-purple-100 border-purple-300 text-purple-600 hover:bg-purple-200"
            >
              ✓
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Type Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab("advert")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedTab === "advert"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              Create Advertisement
            </button>
            <button
              onClick={() => setSelectedTab("promotion")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedTab === "promotion"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              Run a Promotion
            </button>
          </div>

          {/* Promotion Period Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Set Promotion Period</h3>
            <div className="flex gap-3">
              {[
                { value: "7-days", label: "7 Days", cost: "₦5,600" },
                { value: "14-days", label: "14 Days", cost: "₦10,500" },
                { value: "30-days", label: "30 Days", cost: "₦20,000" },
                { value: "custom", label: "Custom" },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPeriod === period.value
                      ? "bg-purple-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            {selectedPeriod !== "custom" && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-gray-700">
                <span className="flex items-center gap-2">
                  ✓ Great choice! You've selected {selectedPeriod}. Your total cost is{" "}
                  <strong>
                    ₦{selectedPeriod === "7-days" ? "5,600" : selectedPeriod === "14-days" ? "10,500" : "20,000"}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <h3 className="font-semibold">Upload Flyer/Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-400 transition-colors">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-medium text-gray-900">Upload service image</p>
              <p className="text-xs text-gray-500 mt-1">(PNG, JPG, JPEG — up to 5MB, 1:1 or 16:9 ratio)</p>
            </div>
          </div>

          {/* Payment Button */}
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium">
            Pay ₦{selectedPeriod === "7-days" ? "5,600" : selectedPeriod === "14-days" ? "10,500" : "20,000"} with
            Paystack
          </Button>
          <p className="text-xs text-gray-500 text-center">Your promotion will go live once payment is confirmed.</p>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      {mockCampaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-lg overflow-hidden border border-gray-200 hover:border-purple-400 transition-colors"
                >
                  <div className="relative h-32 bg-gray-100">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-purple-600">{campaign.engagements} Engagements</Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-xs text-gray-500">{campaign.type}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Live
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">• Live Now • {campaign.daysLeft} days left</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Total Spendings</CardTitle>
            <div className="flex gap-2">
              {["This Month", "Last 6 Months", "Last 12 Months", "All Time"].map((label) => (
                <button
                  key={label}
                  className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-purple-600 border border-gray-200 rounded-full hover:border-purple-300"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-4xl font-bold text-gray-900">₦{totalSpending.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total spent this month</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#9333ea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Promotion Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-2xl font-bold">14 Days</p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <p className="text-xs text-gray-500">Created on the 16th of July</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Views</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Views</p>
            </div>
            <div className="h-10 flex items-center justify-center">
              <div className="w-full flex items-end justify-between gap-1">
                {[30, 45, 35, 50, 60, 55, 70].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-orange-200 rounded-sm"
                    style={{ height: `${(height / 70) * 100}%`, minHeight: "4px" }}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Clicks & Engagements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-2xl font-bold">420</p>
              <p className="text-xs text-gray-500">Interactions</p>
            </div>
            <div className="h-10 flex items-center justify-center">
              <div className="w-full flex items-end justify-between gap-1">
                {[25, 40, 30, 45, 55, 50, 65].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-green-200 rounded-sm"
                    style={{ height: `${(height / 70) * 100}%`, minHeight: "4px" }}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Advert Performance Trends Over Time</CardTitle>
            <select className="px-3 py-1 text-sm border border-gray-200 rounded-lg">
              <option>Views</option>
              <option>Clicks</option>
              <option>Engagements</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-3xl font-bold">Total number of views</p>
            <p className="text-sm text-green-600 font-medium mt-1">{totalViews.toLocaleString()} This month</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value.toLocaleString()} views`} />
              <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
