import { useEffect, useState } from 'react'
import type { AnalyticsData } from '@/lib/types'

export function useAnalyticsData(dateRange?: { start: Date; end: Date }) {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true)
                const params = new URLSearchParams()
                if (dateRange) {
                    params.append('startDate', dateRange.start.toISOString())
                    params.append('endDate', dateRange.end.toISOString())
                }

                const response = await fetch(`/api/analytics?${params}`)
                if (!response.ok) throw new Error('Failed to fetch analytics')

                const analyticsData = await response.json()
                setData(analyticsData)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [dateRange])

    return { data, loading, error }
}
