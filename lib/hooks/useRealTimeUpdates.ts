import { useEffect, useRef, useCallback, useState } from 'react'

interface MachinePosition {
    id: string
    latitude: number
    longitude: number
    timestamp: number
}

interface Alert {
    id: string
    message: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    status: string
    timestamp: number
}

export const useRealTimeUpdates = () => {
    const machinePositionsRef = useRef<Map<string, MachinePosition>>(new Map())
    const alertsRef = useRef<Alert[]>([])

    // Simulate real-time machine position updates
    const simulateMachinePositionUpdate = useCallback(() => {
        // In production, this would come from Socket.IO
        // For now, simulate random position changes
        const machineIds = ['MACH001', 'MACH002', 'MACH003']

        machineIds.forEach(id => {
            const position: MachinePosition = {
                id,
                latitude: 28.5 + (Math.random() - 0.5) * 0.1,
                longitude: 77 + (Math.random() - 0.5) * 0.1,
                timestamp: Date.now(),
            }
            machinePositionsRef.current.set(id, position)
        })

        return machinePositionsRef.current
    }, [])

    // Simulate real-time alert
    const simulateNewAlert = useCallback((alert: Alert) => {
        alertsRef.current.unshift(alert)
        if (alertsRef.current.length > 100) {
            alertsRef.current.pop()
        }
        return alertsRef.current
    }, [])

    // Setup polling for real-time updates
    useEffect(() => {
        // Simulate position updates every 5 seconds
        const positionInterval = setInterval(() => {
            simulateMachinePositionUpdate()
        }, 5000)

        return () => clearInterval(positionInterval)
    }, [simulateMachinePositionUpdate])

    return {
        machinePositions: machinePositionsRef.current,
        alerts: alertsRef.current,
        simulateNewAlert,
    }
}

// Hook for machine-specific real-time updates
export const useRealTimeMachinePosition = (machineId: string) => {
    const [position, setPosition] = useState<MachinePosition | null>(null)

    useEffect(() => {
        const pollPosition = setInterval(() => {
            // Simulate fetching position
            setPosition({
                id: machineId,
                latitude: 28.5 + (Math.random() - 0.5) * 0.02,
                longitude: 77 + (Math.random() - 0.5) * 0.02,
                timestamp: Date.now(),
            })
        }, 3000)

        return () => clearInterval(pollPosition)
    }, [machineId])

    return position
}

// Hook for alerts subscription
export const useRealTimeAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([])

    useEffect(() => {
        const pollAlerts = setInterval(async () => {
            try {
                const res = await fetch('/api/alerts')
                const data = await res.json()
                setAlerts(data)
            } catch (error) {
                console.error('Error polling alerts:', error)
            }
        }, 10000) // Poll every 10 seconds

        return () => clearInterval(pollAlerts)
    }, [])

    return alerts
}
