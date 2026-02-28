"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { StatCard } from "@/components/stat-card";
import {
  Settings,
  Users,
  FileText,
  Download,
  TrendingUp,
  MapPin,
  Clock,
  Activity,
  Award,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const LiveHeatmap = dynamic(() => import("@/components/admin/LiveHeatmap"), {
  ssr: false,
});

interface LiveEvent {
  id: string;
  type: "session_started" | "session_ended" | "alert" | "complaint";
  message: string;
  timestamp: string;
  severity?: "low" | "medium" | "high";
}

interface UtilizationData {
  panchayat_name: string;
  sessions_count: number;
  total_acres: number;
  utilization_score: number;
}

export default function AdminPanel() {
  const [stats, setStats] = useState({
    total_machines: 0,
    active_machines: 0,
    total_chcs: 0,
    total_alerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [utilizationData, setUtilizationData] = useState<UtilizationData[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [machinesRes, chcsRes, alertsRes] = await Promise.all([
          fetch("/api/machines"),
          fetch("/api/chcs"),
          fetch("/api/alerts"),
        ]);

        const machines = await machinesRes.json();
        const chcs = await chcsRes.json();
        const alerts = await alertsRes.json();

        setStats({
          total_machines: machines.length,
          active_machines: machines.filter((m: any) => m.status === "active")
            .length,
          total_chcs: chcs.length,
          total_alerts: alerts.length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
    fetchLiveEvents();
    fetchUtilizationData();

    // Poll for live events every 10 seconds
    const eventInterval = setInterval(fetchLiveEvents, 10000);
    return () => clearInterval(eventInterval);
  }, []);

  const fetchLiveEvents = async () => {
    try {
      const res = await fetch("/api/admin/live-events");
      const data = await res.json();
      setLiveEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching live events:", error);
    }
  };

  const fetchUtilizationData = async () => {
    try {
      const res = await fetch("/api/admin/utilization-audit");
      const data = await res.json();
      setUtilizationData(data.panchayats || []);
    } catch (error) {
      console.error("Error fetching utilization data:", error);
    }
  };

  const handleExportReport = () => {
    const report = `Agricultural Machinery Tracking System - Report
Generated: ${new Date().toLocaleString()}

SYSTEM STATISTICS:
- Total Machines: ${stats.total_machines}
- Active Machines: ${stats.active_machines}
- Total CHCs: ${stats.total_chcs}
- Active Alerts: ${stats.total_alerts}

This report contains system-wide statistics for administrative oversight.`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agritrack-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    a.click();
  };

  return (
    <div className="flex">
      <SidebarNav />
      <main className="lg:ml-64 flex-1 bg-slate-50 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-center">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">
                Admin Control Panel
              </h1>
              <p className="text-slate-600 mt-2 text-sm lg:text-base">
                System-wide administration and oversight
              </p>
            </div>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-green-700 text-sm lg:text-base w-full lg:w-auto justify-center lg:justify-start"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  label="Total Machines"
                  value={stats.total_machines}
                  icon={<Settings className="w-8 h-8 text-blue-600" />}
                  color="blue"
                />
                <StatCard
                  label="Active Machines"
                  value={stats.active_machines}
                  icon={<Settings className="w-8 h-8 text-green-600" />}
                  color="green"
                />
                <StatCard
                  label="Total CHCs"
                  value={stats.total_chcs}
                  icon={<Users className="w-8 h-8 text-yellow-600" />}
                  color="yellow"
                />
                <StatCard
                  label="Active Alerts"
                  value={stats.total_alerts}
                  icon={<FileText className="w-8 h-8 text-red-600" />}
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    System Configuration
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        Real-time Update Interval
                      </span>
                      <span className="text-slate-600">5 seconds</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        Alert Threshold
                      </span>
                      <span className="text-slate-600">Configurable</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        Data Retention
                      </span>
                      <span className="text-slate-600">90 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        Backup Status
                      </span>
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    User Management
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        Admin Users
                      </span>
                      <span className="text-slate-600">5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        CHC Operators
                      </span>
                      <span className="text-slate-600">150+</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        Active Sessions
                      </span>
                      <span className="text-slate-600">42</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        Last Audit
                      </span>
                      <span className="text-slate-600">Today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Activity Ticker */}
              <Card className="p-6 mt-6 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Live Activity Feed
                  </h2>
                  <Badge variant="outline" className="ml-auto">
                    Real-time
                  </Badge>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {liveEvents.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">
                      No recent activity
                    </p>
                  ) : (
                    liveEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="mt-1">
                          {event.type === "session_started" && (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          )}
                          {event.type === "session_ended" && (
                            <Clock className="h-5 w-5 text-gray-600" />
                          )}
                          {event.type === "alert" && (
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                event.severity === "high"
                                  ? "text-red-600"
                                  : event.severity === "medium"
                                  ? "text-orange-600"
                                  : "text-yellow-600"
                              }`}
                            />
                          )}
                          {event.type === "complaint" && (
                            <FileText className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">
                            {event.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Live Heatmap */}
              <Card className="p-6 mt-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-green-600" />
                    <h2 className="text-xl font-bold text-slate-900">
                      Machine Activity Heatmap
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className="text-sm px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    {showHeatmap ? "Hide" : "Show"} Heatmap
                  </button>
                </div>
                {showHeatmap && (
                  <div className="h-96 rounded-lg overflow-hidden border-2 border-slate-200">
                    <LiveHeatmap />
                  </div>
                )}
              </Card>

              {/* Utilization Audit Chart */}
              <Card className="p-6 mt-6 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Panchayat Utilization Audit
                  </h2>
                </div>
                <div className="space-y-3">
                  {utilizationData.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">
                      No data available
                    </p>
                  ) : (
                    utilizationData.map((panchayat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {panchayat.panchayat_name}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-slate-600">
                            <span>Sessions: {panchayat.sessions_count}</span>
                            <span>•</span>
                            <span>
                              Acres: {panchayat.total_acres.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                panchayat.utilization_score >= 70
                                  ? "bg-green-600"
                                  : panchayat.utilization_score >= 40
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }`}
                              style={{
                                width: `${panchayat.utilization_score}%`,
                              }}
                            ></div>
                          </div>
                          <span className="font-bold text-lg text-slate-900 w-12 text-right">
                            {panchayat.utilization_score}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  System Health
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">API Response Time</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      145ms
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">Database Status</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      Healthy
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">Uptime</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      99.9%
                    </p>
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
