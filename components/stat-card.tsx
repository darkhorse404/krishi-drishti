import type React from "react"
interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  color?: "green" | "blue" | "yellow" | "red"
}

export function StatCard({ label, value, subtext, icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
    red: "bg-red-50 border-red-200",
  }

  const textColorClasses = {
    green: "text-green-700",
    blue: "text-blue-700",
    yellow: "text-yellow-700",
    red: "text-red-700",
  }

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${textColorClasses[color]}`}>{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </div>
  )
}
