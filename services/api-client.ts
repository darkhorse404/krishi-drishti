import type { Machine, Alert, CustomHiringCentre, AnalyticsData, Booking, MaintenanceRecord } from '@/lib/types'

class APIClient {
    private baseURL = '/api'

    private toQueryString(filters?: Record<string, string | undefined>): string {
        if (!filters) return ''

        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value)
            }
        })

        return params.toString()
    }

    async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error(`API Error (${response.status}):`, errorData)
                throw new Error(`API Error: ${response.statusText}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Request failed for ${endpoint}:`, error)
            throw error
        }
    }

    // Legacy request method for compatibility
    private async legacyRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }

        return response.json()
    }

    // Machines
    async getMachines(filters?: Record<string, string | undefined>): Promise<Machine[]> {
        const query = this.toQueryString(filters)
        return this.request(`/machines${query ? `?${query}` : ''}`)
    }

    async getMachineById(id: string): Promise<Machine> {
        return this.request(`/machines/${id}`)
    }

    async createMachine(data: Partial<Machine>): Promise<Machine> {
        return this.request('/machines', { method: 'POST', body: JSON.stringify(data) })
    }

    async updateMachine(id: string, data: Partial<Machine>): Promise<Machine> {
        return this.request(`/machines/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    }

    async deleteMachine(id: string): Promise<void> {
        return this.request(`/machines/${id}`, { method: 'DELETE' })
    }

    // Alerts
    async getAlerts(filters?: Record<string, string | undefined>): Promise<Alert[]> {
        const query = this.toQueryString(filters)
        return this.request(`/alerts${query ? `?${query}` : ''}`)
    }

    async getAlertById(id: string): Promise<Alert> {
        return this.request(`/alerts/${id}`)
    }

    async updateAlertStatus(id: string, status: string): Promise<Alert> {
        return this.request(`/alerts/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    }

    async acknowledgeAlert(id: string): Promise<Alert> {
        return this.request(`/alerts/${id}/acknowledge`, { method: 'POST' })
    }

    async resolveAlert(id: string): Promise<Alert> {
        return this.request(`/alerts/${id}/resolve`, { method: 'POST' })
    }

    // CHCs
    async getCHCs(): Promise<CustomHiringCentre[]> {
        return this.request('/chcs')
    }

    async getCHCById(id: string): Promise<CustomHiringCentre> {
        return this.request(`/chcs/${id}`)
    }

    async createCHC(data: Partial<CustomHiringCentre>): Promise<CustomHiringCentre> {
        return this.request('/chcs', { method: 'POST', body: JSON.stringify(data) })
    }

    async updateCHC(id: string, data: Partial<CustomHiringCentre>): Promise<CustomHiringCentre> {
        return this.request(`/chcs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    }

    // Analytics
    async getAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsData> {
        const query = new URLSearchParams()
        if (startDate) query.append('startDate', startDate)
        if (endDate) query.append('endDate', endDate)
        return this.request(`/analytics?${query.toString()}`)
    }

    // Bookings
    async getBookings(filters?: Record<string, string | undefined>): Promise<Booking[]> {
        const query = this.toQueryString(filters)
        return this.request(`/bookings${query ? `?${query}` : ''}`)
    }

    async createBooking(data: Partial<Booking>): Promise<Booking> {
        return this.request('/bookings', { method: 'POST', body: JSON.stringify(data) })
    }

    async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
        return this.request(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    }

    // Maintenance
    async getMaintenance(machineId: string): Promise<MaintenanceRecord[]> {
        return this.request(`/machines/${machineId}/maintenance`)
    }

    async createMaintenanceRecord(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
        return this.request('/maintenance', { method: 'POST', body: JSON.stringify(data) })
    }
}

export const apiClient = new APIClient()
