"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { StatCard } from "@/components/stat-card";
import type { Machine, Alert } from "@/lib/types";
import { MapPin, AlertTriangle, Zap, Clock } from "lucide-react";

export default function TrackingDashboard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machinesRes, alertsRes] = await Promise.all([
          fetch("/api/machines"),
          fetch("/api/alerts"),
        ]);

        const machinesData = await machinesRes.json();
        const alertsData = await alertsRes.json();

        setMachines(machinesData);
        setAlerts(alertsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeMachines = machines.filter((m) => m.status === "active").length;
  const idleMachines = machines.filter((m) => m.status === "idle").length;
  const maintenanceMachines = machines.filter(
    (m) => m.status === "maintenance"
  ).length;
  const activeAlerts = alerts.filter((a) => a.status === "open").length;

  return (
    <div className="flex">
      <SidebarNav />
      <main className="lg:ml-64 flex-1 bg-slate-50 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">
              Real-Time Tracking Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-sm lg:text-base">
              Monitor all agricultural machinery in real-time
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
                <StatCard
                  label="Total Machines"
                  value={machines.length}
                  subtext="Across all CHCs"
                  icon={<MapPin className="w-8 h-8 text-blue-600" />}
                  color="blue"
                />
                <StatCard
                  label="Active Machines"
                  value={activeMachines}
                  subtext={`${(
                    (activeMachines / machines.length) *
                    100
                  ).toFixed(1)}% utilization`}
                  icon={<Zap className="w-8 h-8 text-green-600" />}
                  color="green"
                />
                <StatCard
                  label="Idle Machines"
                  value={idleMachines}
                  subtext="Awaiting deployment"
                  icon={<Clock className="w-8 h-8 text-yellow-600" />}
                  color="yellow"
                />
                <StatCard
                  label="Active Alerts"
                  value={activeAlerts}
                  subtext="Require attention"
                  icon={<AlertTriangle className="w-8 h-8 text-red-600" />}
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Machine Status Distribution
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Active
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {activeMachines}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (activeMachines / machines.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Idle
                        </span>
                        <span className="text-sm font-bold text-yellow-600">
                          {idleMachines}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{
                            width: `${(idleMachines / machines.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Maintenance
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {maintenanceMachines}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (maintenanceMachines / machines.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Recent Alerts
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {alerts.slice(0, 8).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          alert.severity === "high"
                            ? "bg-red-50 border-red-500"
                            : alert.severity === "medium"
                            ? "bg-yellow-50 border-yellow-500"
                            : "bg-blue-50 border-blue-500"
                        }`}
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {alert.machine_id}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {alert.alert_type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
