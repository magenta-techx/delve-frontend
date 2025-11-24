import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

interface StatCardProps {
  icon: ReactNode
  value: number | string
  label: string
  subtitle?: string
  sublabel?: string
  metric?: {
    label: string
    value: string
    color: string
  }
  actionLabel?: string
  color?: "purple" | "orange" | "yellow" | "green"
}

const colorClasses = {
  purple: "text-purple-500",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  green: "text-green-500",
}

export function StatCard({ icon, value, label, subtitle, sublabel, metric, actionLabel, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle || sublabel}</p>
          {actionLabel && (
            <p className={`text-xs font-semibold mt-2 ${color ? colorClasses[color] : "text-blue-500"}`}>
              {actionLabel}
            </p>
          )}
        </div>
      </div>
      {metric && (
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span style={{ color: metric.color }} className="font-semibold">
            {metric.value}
          </span>
          <span className="text-muted-foreground">{metric.label}</span>
          <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
