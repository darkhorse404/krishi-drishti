"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { MachineManagementTable } from "@/components/machines/MachineManagementTable"
import { MachineModal } from "@/components/modals/MachineModal"
import type { Machine } from "@/lib/types"

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | undefined>(undefined)

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await fetch("/api/machines")
        const data = await res.json()
        setMachines(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching machines:", error)
        setLoading(false)
      }
    }

    fetchMachines()
  }, [])

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine)
    setShowModal(true)
  }

  const handleDelete = (machineId: string) => {
    if (confirm("Are you sure you want to delete this machine?")) {
      console.log("Delete machine:", machineId)
      // TODO: Call API to delete
    }
  }

  const handleView = (machine: Machine) => {
    setEditingMachine(machine)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingMachine(undefined)
    setShowModal(true)
  }

  const handleBulkDelete = (machineIds: string[]) => {
    if (confirm(`Delete ${machineIds.length} machines?`)) {
      console.log("Bulk delete machines:", machineIds)
      // TODO: Call API to bulk delete
    }
  }

  const handleModalSubmit = async (data: any) => {
    try {
      if (editingMachine) {
        console.log("Updating machine:", data)
        // TODO: Call PUT /api/machines/{id}
      } else {
        console.log("Creating machine:", data)
        const response = await fetch("/api/machines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create machine")
        }

        const created = await response.json()
        console.log("Machine created successfully:", created)
      }
      setShowModal(false)
      setEditingMachine(undefined)
      // Refresh machines list
      const res = await fetch("/api/machines")
      const updated = await res.json()
      setMachines(updated)
    } catch (error) {
      console.error("Error saving machine:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Failed to save machine"}`)
    }
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="lg:ml-64 flex-1 bg-slate-50 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">Machine Management</h1>
          <p className="text-slate-600 mt-2">Search and manage all machinery</p>
        </div>

        <MachineManagementTable
          machines={machines}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onAdd={handleAdd}
          onBulkDelete={handleBulkDelete}
        />

        <MachineModal
          isOpen={showModal}
          machine={editingMachine}
          onClose={() => {
            setShowModal(false)
            setEditingMachine(undefined)
          }}
          onSubmit={handleModalSubmit}
        />
      </main>
    </div>
  )
}
