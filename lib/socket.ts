import { Server as HTTPServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as IOServer, Socket } from 'socket.io'

const ioHandlers: { [key: string]: (socket: Socket, data: any) => void } = {}

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new IOServer(httpServer, {
        cors: {
            origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket: Socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`)

        // Subscribe to machine position updates
        socket.on('subscribe_machine_positions', () => {
            console.log(`[Socket] Client subscribed to machine positions: ${socket.id}`)
            socket.join('machine_positions')
        })

        // Subscribe to alerts
        socket.on('subscribe_alerts', () => {
            console.log(`[Socket] Client subscribed to alerts: ${socket.id}`)
            socket.join('alerts')
        })

        // Subscribe to CHC updates
        socket.on('subscribe_chc_updates', (chcId: string) => {
            console.log(`[Socket] Client subscribed to CHC updates: ${chcId}`)
            socket.join(`chc_${chcId}`)
        })

        // Handle machine position update
        socket.on('machine_position_update', (data: any) => {
            console.log(`[Socket] Machine position update:`, data)
            io.to('machine_positions').emit('machine_position_updated', data)
        })

        // Handle new alert
        socket.on('new_alert', (alert: any) => {
            console.log(`[Socket] New alert:`, alert)
            io.to('alerts').emit('alert_created', alert)
        })

        // Handle alert status change
        socket.on('alert_status_change', (data: any) => {
            console.log(`[Socket] Alert status change:`, data)
            io.to('alerts').emit('alert_status_changed', data)
        })

        // Disconnect handler
        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`)
        })

        // Error handler
        socket.on('error', (error: any) => {
            console.error(`[Socket] Error for ${socket.id}:`, error)
        })
    })

    return io
}

export default initializeSocket
