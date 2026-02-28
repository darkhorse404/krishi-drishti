import { useEffect, useState, useCallback } from 'react'
import type { Machine } from '@/lib/types'

interface FilterState {
    search: string
    states: string[]
    districts: string[]
    machineTypes: string[]
    statuses: string[]
    chcs: string[]
    utilizationRange: [number, number]
    lastActiveRange: [Date | null, Date | null]
}

export function useMachineFilters(machines: Machine[]) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        states: [],
        districts: [],
        machineTypes: [],
        statuses: [],
        chcs: [],
        utilizationRange: [0, 100],
        lastActiveRange: [null, null],
    })

    const [filteredMachines, setFilteredMachines] = useState<Machine[]>(machines)

    const updateFilter = useCallback(
        (key: keyof FilterState, value: any) => {
            setFilters((prev) => ({ ...prev, [key]: value }))
        },
        []
    )

    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            states: [],
            districts: [],
            machineTypes: [],
            statuses: [],
            chcs: [],
            utilizationRange: [0, 100],
            lastActiveRange: [null, null],
        })
    }, [])

    useEffect(() => {
        let result = machines

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            result = result.filter(
                (m) =>
                    m.id.toLowerCase().includes(searchLower) ||
                    m.registration_number.toLowerCase().includes(searchLower)
            )
        }

        // State filter
        if (filters.states.length > 0) {
            result = result.filter((m) => filters.states.includes(m.current_location.state || ''))
        }

        // District filter
        if (filters.districts.length > 0) {
            result = result.filter((m) => filters.districts.includes(m.current_location.district || ''))
        }

        // Machine type filter
        if (filters.machineTypes.length > 0) {
            result = result.filter((m) => filters.machineTypes.includes(m.machine_type))
        }

        // Status filter
        if (filters.statuses.length > 0) {
            result = result.filter((m) => filters.statuses.includes(m.status))
        }

        // CHC filter
        if (filters.chcs.length > 0) {
            result = result.filter((m) => filters.chcs.includes(m.chc_id))
        }

        // Utilization range filter
        result = result.filter(
            (m) =>
                m.utilization_rate >= filters.utilizationRange[0] &&
                m.utilization_rate <= filters.utilizationRange[1]
        )

        // Last active date range filter
        if (filters.lastActiveRange[0] || filters.lastActiveRange[1]) {
            result = result.filter((m) => {
                const lastActive = new Date(m.last_active)
                if (filters.lastActiveRange[0] && lastActive < filters.lastActiveRange[0]) return false
                if (filters.lastActiveRange[1] && lastActive > filters.lastActiveRange[1]) return false
                return true
            })
        }

        setFilteredMachines(result)
    }, [machines, filters])

    return {
        filters,
        filteredMachines,
        updateFilter,
        clearFilters,
    }
}
