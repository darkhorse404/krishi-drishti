import React from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import type { AnalyticsData } from '@/lib/types'

interface UtilizationChartsProps {
  data: AnalyticsData | null
  loading?: boolean
}

export function UtilizationTrendChart({ data, loading }: UtilizationChartsProps) {
  if (loading || !data) {
    return <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Hourly Utilization Trend (Last 48 Hours)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.utilization_trend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="utilization" stroke="#3b82f6" name="Utilization %" />
          <Line type="monotone" dataKey="machines_active" stroke="#10b981" name="Machines Active" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StateDistributionChart({ data, loading }: UtilizationChartsProps) {
  if (loading || !data) {
    return <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Top 10 States by Machine Count</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.state_distribution.slice(0, 10)} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="state" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="machines" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MachineTypeBreakdownChart({ data, loading }: UtilizationChartsProps) {
  if (loading || !data) {
    return <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Machine Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data.machine_type_breakdown}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ type, count }) => `${type}: ${count}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.machine_type_breakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CHCPerformanceChart({ data, loading }: UtilizationChartsProps) {
  if (loading || !data) {
    return <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
  }

  const chartData = [
    ...data.top_chcs.map((chc) => ({ ...chc, type: 'Top' })),
    ...data.bottom_chcs.map((chc) => ({ ...chc, type: 'Bottom' })),
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">CHC Performance (Top vs Bottom)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avg_utilization" fill="#3b82f6" name="Avg Utilization %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GaugeChart({ value, target = 70 }: { value: number; target?: number }) {
  const percentage = Math.min((value / 100) * 360, 360)
  const isAboveTarget = value >= target

  return (
    <div className="flex items-center justify-center">
      <svg width={200} height={200} viewBox="0 0 200 200">
        {/* Background circle */}
        <circle cx={100} cy={100} r={80} fill="none" stroke="#e5e7eb" strokeWidth={4} />

        {/* Target line */}
        <line
          x1={100}
          y1={30}
          x2={100}
          y2={20}
          stroke="#f59e0b"
          strokeWidth={2}
          transform={`rotate(${(target / 100) * 360 - 90} 100 100)`}
        />

        {/* Progress arc */}
        <circle
          cx={100}
          cy={100}
          r={80}
          fill="none"
          stroke={isAboveTarget ? '#10b981' : '#ef4444'}
          strokeWidth={4}
          strokeDasharray={`${percentage} ${360}`}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />

        {/* Center text */}
        <text x={100} y={100} textAnchor="middle" dy="0.3em" className="text-3xl font-bold">
          {value}%
        </text>
        <text x={100} y={120} textAnchor="middle" className="text-xs fill-slate-600">
          System Utilization
        </text>
      </svg>
    </div>
  )
}
