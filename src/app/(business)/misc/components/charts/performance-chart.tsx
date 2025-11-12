"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface PerformanceChartProps {
  data: Array<{ date: string; value: number }>
  strokeColor?: string
}

export function PerformanceChart({ data, strokeColor = "#FF9F64" }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500">☀️</span>
          <CardTitle>Performance Trends Over Time</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          Reviews & Ratings
          <ChevronDown className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Review Analytics</h3>
            <p className="text-3xl font-bold">
              36 <span className="text-sm font-normal text-green-600">This month</span>
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                fill="url(#colorGradient)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
