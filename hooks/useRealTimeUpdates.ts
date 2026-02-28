import { useEffect, useState, useCallback, useRef } from 'react'
import type { Machine, MachinePosition } from '@/lib/types'
import io, { type Socket } from 'socket.io-client'

export function useRealTimeUpdates() {
    const [machines, setMachines] = useState<Machine[]>([])
    const [positions, setPositions] = useState<Map<string, MachinePosition>>(new Map())
    const [isConnected, setIsConnected] = useState(false)
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        // Initialize Socket.IO connection
        socketRef.current = io(undefined, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        })

        socketRef.current.on('connect', () => {
            setIsConnected(true)
            console.log('Connected to real-time server')
        })

        socketRef.current.on('disconnect', () => {
            setIsConnected(false)
            console.log('Disconnected from real-time server')
        })

        // Listen for machine position updates
        socketRef.current.on('machine:position:update', (position: MachinePosition) => {
            setPositions((prev) => new Map(prev).set(position.machine_id, position))
        })

        // Listen for machine status changes
        socketRef.current.on('machine:status:change', (data: { machine_id: string; status: string }) => {
            setMachines((prev) =>
                prev.map((m) => (m.id === data.machine_id ? { ...m, status: data.status as any } : m))
            )
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [])

    const emitEvent = useCallback((event: string, data: any) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, data)
        }
    }, [])

    return {
        machines,
        setMachines,
        positions,
        isConnected,
        emitEvent,
    }
}
