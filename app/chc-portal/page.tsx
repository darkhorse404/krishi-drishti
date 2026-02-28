"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  Calendar,
  MapPin,
  Zap,
  DollarSign,
  Star,
} from "lucide-react";
import type { Machine, MaintenanceRecord } from "@/lib/types";

interface BookingData {
  id: string;
  machine_id: string;
  farmer_name: string;
  phone_number: string;
  area_covered: number;
  start_time: string;
  end_time: string;
  status: "completed" | "ongoing" | "scheduled";
}

interface CHCStats {
  totalMachines: number;
  activeMachines: number;
  idleMachines: number;
  maintenanceNeeded: number;
  occupancyRate: number;
  revenueThisMonth: number;
  performanceRating: number;
  avgUtilization: number;
}

export default function CHCPortalPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [stats, setStats] = useState<CHCStats>({
    totalMachines: 0,
    activeMachines: 0,
    idleMachines: 0,
    maintenanceNeeded: 0,
    occupancyRate: 0,
    revenueThisMonth: 125000,
    performanceRating: 4.7,
    avgUtilization: 82,
  });
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machinesRes, bookingsRes, maintenanceRes] = await Promise.all([
          fetch("/api/machines"),
          fetch("/api/bookings").catch(() => ({ json: () => [] })),
          fetch("/api/maintenance").catch(() => ({ json: () => [] })),
        ]);

        const machinesData = await machinesRes.json();
        const bookingsData = await bookingsRes.json();
        const maintenanceData = await maintenanceRes.json();

        setMachines(machinesData || []);
        setBookings(bookingsData || []);
        setMaintenance(maintenanceData || []);

        // Calculate stats
        const activeMachines = machinesData.filter(
          (m: Machine) => m.status === "active"
        ).length;
        const idleMachines = machinesData.filter(
          (m: Machine) => m.status === "idle"
        ).length;
        const maintenanceMachines = machinesData.filter(
          (m: Machine) => m.status === "maintenance"
        ).length;
        const maintenanceNeeded = maintenanceData.filter(
          (m: any) => !m.service_date
        ).length;

        const avgUtilization =
          machinesData.length > 0
            ? Math.round(
                machinesData.reduce(
                  (sum: number, m: Machine) => sum + m.utilization_rate,
                  0
                ) / machinesData.length
              )
            : 0;

        const occupancyRate =
          machinesData.length > 0
            ? Math.round((activeMachines / machinesData.length) * 100)
            : 0;

        setStats({
          totalMachines: machinesData.length,
          activeMachines,
          idleMachines,
          maintenanceNeeded: maintenanceMachines + maintenanceNeeded,
          occupancyRate,
          revenueThisMonth: 125000 + activeMachines * 5000,
          performanceRating: 4.7,
          avgUtilization,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getMachineStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "idle":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex">
      <SidebarNav />
      <main className="lg:ml-64 flex-1 bg-slate-50 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">
            CHC Operations Dashboard
          </h1>
          <p className="text-slate-600 mt-2 text-sm lg:text-base">
            Manage machinery, bookings, and maintenance operations
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading CHC data...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-600 text-sm font-semibold">
                    Total Machines
                  </p>
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalMachines}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {stats.activeMachines} active
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-600 text-sm font-semibold">
                    Occupancy Rate
                  </p>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.occupancyRate}%
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Current utilization
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-600 text-sm font-semibold">
                    Revenue
                  </p>
                  <DollarSign className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  ₹{(stats.revenueThisMonth / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-slate-500 mt-2">This month</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-600 text-sm font-semibold">Rating</p>
                  <Star className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.performanceRating}★
                </p>
                <p className="text-xs text-slate-500 mt-2">Performance</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Machines Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Machinery Fleet
                    </h2>
                    <span className="text-sm text-slate-500">
                      {machines.length} total
                    </span>
                  </div>

                  {machines.length > 0 ? (
                    <div className="space-y-4">
                      {machines.map((machine) => (
                        <div
                          key={machine.id}
                          className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                          onClick={() => setSelectedMachine(machine)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-slate-900">
                                {machine.registration_number}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {machine.machine_type}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getMachineStatusColor(
                                machine.status
                              )}`}
                            >
                              {machine.status.charAt(0).toUpperCase() +
                                machine.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-slate-600">Utilization</p>
                              <p className="font-semibold text-slate-900">
                                {machine.utilization_rate}%
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600">Fuel Level</p>
                              <p className="font-semibold text-slate-900">
                                {machine.fuel_level}%
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600">Hours</p>
                              <p className="font-semibold text-slate-900">
                                {machine.total_hours}h
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-600">No machines available</p>
                    </div>
                  )}
                </div>

                {/* Bookings Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Recent Bookings
                    </h2>
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>

                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div
                          key={booking.id}
                          className="border rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {booking.farmer_name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {booking.area_covered} hectares covered
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "ongoing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {(booking.status || "scheduled")
                                .charAt(0)
                                .toUpperCase() +
                                (booking.status || "scheduled").slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-600">No bookings yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Earnings Calculator */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Earnings Calculator
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Current Month Earnings */}
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-slate-600 mb-1">
                        This Month (Actual)
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        ₹{stats.revenueThisMonth.toLocaleString()}
                      </p>
                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Active Sessions</span>
                          <span className="font-semibold">
                            {stats.activeMachines}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Rate/Session</span>
                          <span className="font-semibold">
                            ₹
                            {(
                              stats.revenueThisMonth /
                              Math.max(stats.activeMachines, 1)
                            ).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Projected Next Month */}
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-slate-600 mb-1">
                        Projected Next Month
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹
                        {(stats.revenueThisMonth * 1.15).toLocaleString(
                          "en-IN",
                          { maximumFractionDigits: 0 }
                        )}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-blue-600 font-semibold">
                          +15% Growth
                        </span>
                      </div>
                    </div>

                    {/* Session Breakdown */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-slate-700 mb-3">
                        Revenue Breakdown
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600">
                            Machine Rentals
                          </span>
                          <span className="font-semibold text-slate-900">
                            ₹
                            {(stats.revenueThisMonth * 0.75).toLocaleString(
                              "en-IN",
                              { maximumFractionDigits: 0 }
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center text-xs mt-3">
                          <span className="text-slate-600">
                            Service Charges
                          </span>
                          <span className="font-semibold text-slate-900">
                            ₹
                            {(stats.revenueThisMonth * 0.15).toLocaleString(
                              "en-IN",
                              { maximumFractionDigits: 0 }
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: "15%" }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center text-xs mt-3">
                          <span className="text-slate-600">
                            Subsidies Received
                          </span>
                          <span className="font-semibold text-slate-900">
                            ₹
                            {(stats.revenueThisMonth * 0.1).toLocaleString(
                              "en-IN",
                              { maximumFractionDigits: 0 }
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: "10%" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Tip */}
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800">
                          <span className="font-semibold">Tip:</span> Increase
                          utilization by {100 - stats.avgUtilization}% to earn
                          an additional ₹
                          {(
                            (stats.revenueThisMonth *
                              (100 - stats.avgUtilization)) /
                            100
                          ).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          this month!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Machine Details */}
                {selectedMachine && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Machine Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-slate-600">Registration</p>
                        <p className="font-semibold text-slate-900">
                          {selectedMachine.registration_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Type</p>
                        <p className="font-semibold text-slate-900">
                          {selectedMachine.machine_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Make</p>
                        <p className="font-semibold text-slate-900">
                          {selectedMachine.make}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Model</p>
                        <p className="font-semibold text-slate-900">
                          {selectedMachine.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Year</p>
                        <p className="font-semibold text-slate-900">
                          {selectedMachine.year}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Total Hours</p>
                        <p className="font-semibold text-slate-900">
                          {selectedMachine.total_hours} hours
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alerts/Issues */}
                {stats.maintenanceNeeded > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-red-900">
                        Maintenance Alerts
                      </h3>
                    </div>
                    <p className="text-sm text-red-800">
                      {stats.maintenanceNeeded} machines need maintenance
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Fleet Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Active</span>
                      <span className="font-semibold text-green-600">
                        {stats.activeMachines}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Idle</span>
                      <span className="font-semibold text-yellow-600">
                        {stats.idleMachines}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">In Maintenance</span>
                      <span className="font-semibold text-red-600">
                        {stats.maintenanceNeeded}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-slate-600 font-semibold">
                        Avg Utilization
                      </span>
                      <span className="font-bold text-slate-900">
                        {stats.avgUtilization}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
