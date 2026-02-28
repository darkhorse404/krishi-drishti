import React from 'react';
import {
  TrendingUp, 
  TrendingDown, 
  Zap, 
  AlertCircle, 
  Clock, 
  Gauge,
  MapPin,
  Phone,
  Eye,
  Navigation,
  AlertTriangle,
  Flame,
  FileText,
  Activity,
  Target,
} from "lucide-react";
import { AnalyticsData } from "@/lib/types";

// Machine data interface for the live fleet table
interface MachineFleetData {
  id: string;
  type: string;
  chc: string;
  status: "working" | "idle" | "transit" | "no_signal";
  output: string;
  location: string;
  action: string;
  idleHours?: number;
}

// KPI Pulse Card Component
interface PulseCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status: "good" | "warning" | "critical";
  subtitle?: string;
}

const PulseCard: React.FC<PulseCardProps> = ({
  title,
  value,
  icon,
  status,
  subtitle,
}) => {
  const getCardStyles = () => {
    switch (status) {
      case "good":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "critical":
        return "bg-red-50 border-red-200 text-red-800 animate-pulse";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIconStyles = () => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={`${getCardStyles()} rounded-lg border-2 p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
        </div>
        <div className={`${getIconStyles()} opacity-60`}>{icon}</div>
      </div>
    </div>
  );
};

// Alert Item Component
interface AlertItemProps {
  type: "high" | "medium" | "task";
  message: string;
  action?: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ type, message, action }) => {
  const getAlertStyles = () => {
    switch (type) {
      case "high":
        return "bg-red-50 border-l-4 border-red-500 text-red-800";
      case "medium":
        return "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800";
      case "task":
        return "bg-blue-50 border-l-4 border-blue-500 text-blue-800";
      default:
        return "bg-gray-50 border-l-4 border-gray-500 text-gray-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "high":
        return <Flame size={16} className="text-red-600" />;
      case "medium":
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case "task":
        return <FileText size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className={`${getAlertStyles()} p-4 rounded-r-lg mb-3`}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {action && <p className="text-xs mt-1 opacity-70">{action}</p>}
        </div>
      </div>
    </div>
  );
};

interface AnalyticsDashboardProps {
  data: AnalyticsData | null;
  loading?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  loading = false,
}) => {
  // Mock data for the live fleet status table as requested
  const machineFleetData: MachineFleetData[] = [
    {
      id: "PB-AMB-01",
      type: "Super Seeder",
      chc: "Khalsa CHC",
      status: "working",
      output: "6.2 Acres",
      location: "Field 44 (North)",
      action: "Track",
    },
    {
      id: "PB-AMB-02",
      type: "Happy Seeder",
      chc: "Khalsa CHC",
      status: "working",
      output: "5.8 Acres",
      location: "Field 12 (East)",
      action: "Track",
    },
    {
      id: "PB-AMB-03",
      type: "Baler (Large)",
      chc: "Green Agro",
      status: "idle",
      idleHours: 4,
      output: "0.0 Acres",
      location: "Warehouse",
      action: "Call Owner",
    },
    {
      id: "PB-AMB-04",
      type: "Mulcher",
      chc: "Gill Bros",
      status: "transit",
      output: "N/A",
      location: "Main Road",
      action: "View Path",
    },
    {
      id: "PB-AMB-05",
      type: "Super Seeder",
      chc: "Gill Bros",
      status: "no_signal",
      output: "--",
      location: "Last seen 2 days ago",
      action: "Audit",
    },
    {
      id: "PB-AMB-06",
      type: "RMB Plough",
      chc: "Panchayat",
      status: "working",
      output: "4.1 Acres",
      location: "Field 09 (South)",
      action: "Track",
    },
  ];

  const totalMachines = machineFleetData.length;
  const activeMachines = machineFleetData.filter(
    (m) => m.status === "working"
  ).length;
  const activeFleetFraction = `${activeMachines} / ${totalMachines}`;
  const activeFleetPercentage = (activeMachines / totalMachines) * 100;

  const todaysCoverage = machineFleetData
    .filter((m) => m.status === "working" && m.output.includes("Acres"))
    .reduce((acc, m) => acc + parseFloat(m.output), 0)
    .toFixed(1);

  const fireAlerts = 0; // Placeholder
  const pendingComplaints = 1; // Placeholder

  const villageTargetAcres = 1000;
  const currentCoverageAcres = 450;
  const coveragePercentage = (currentCoverageAcres / villageTargetAcres) * 100;

  const getStatusIndicator = (status: MachineFleetData["status"]) => {
    switch (status) {
      case "working":
        return (
          <div
            className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
            title="Working"
          ></div>
        );
      case "idle":
        return (
          <div className="w-3 h-3 rounded-full bg-red-500" title="Idle"></div>
        );
      case "transit":
        return (
          <div
            className="w-3 h-3 rounded-full bg-yellow-500"
            title="In Transit"
          ></div>
        );
      case "no_signal":
        return (
          <div
            className="w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-600"
            title="No Signal"
          ></div>
        );
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Track":
        return <Navigation size={16} />;
      case "Call Owner":
        return <Phone size={16} />;
      case "View Path":
        return <MapPin size={16} />;
      case "Audit":
        return <Eye size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Bar: "Pulse" KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <PulseCard
          title="Active Fleet"
          value={activeFleetFraction}
          subtitle="Machines running now"
          icon={<Activity size={28} />}
          status={activeFleetPercentage < 50 ? "critical" : "good"}
        />
        <PulseCard
          title="Today's Coverage"
          value={`${todaysCoverage} Acres`}
          subtitle="Area processed today"
          icon={<Target size={28} />}
          status="good"
        />
        <PulseCard 
          title="Burn Alerts" 
          value={fireAlerts}
          subtitle="Active satellite burned spots"
          icon={<Flame size={28} />} 
          status={fireAlerts > 0 ? 'critical' : 'good'} 
        />
        <PulseCard
          title="Pending Complaints"
          value={pendingComplaints}
          subtitle="Farmer issues to resolve"
          icon={<AlertCircle size={28} />}
          status={pendingComplaints > 0 ? "warning" : "good"}
        />
      </div>

      {/* 2. Village Utilization Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold text-gray-700">
            Village Stubble Burning Prevention Target
          </h3>
          <span className="text-sm font-bold text-gray-800">
            {currentCoverageAcres} / {villageTargetAcres} Acres (
            {coveragePercentage.toFixed(0)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${coveragePercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Progress towards making the village stubble-free before the deadline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Main Section: Live Fleet Status Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Village Machinery Live Status
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Machine ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CHC / Owner
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status (Live)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Today's Output
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {machineFleetData.map((machine) => (
                  <tr key={machine.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {machine.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {machine.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {machine.chc}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {getStatusIndicator(machine.status)}
                        <span className="capitalize">
                          {machine.status === "idle"
                            ? `Idle (${machine.idleHours}h)`
                            : machine.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {machine.output}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {machine.location}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                        {getActionIcon(machine.action)}
                        {machine.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Side Panel: Action Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Action Items
          </h2>
          <div>
            <AlertItem
              type="high"
              message="Residue Burning at Sector 4 (Coords: 30.7, 76.7)."
              action="Verify immediately."
            />
            <AlertItem
              type="medium"
              message="Machine PB-AMB-05 offline for >48 hours."
              action="Visit Gill Bros CHC."
            />
            <AlertItem
              type="task"
              message="Farmer Ram Singh reported: 'Machine Refusal'."
              action="Resolve Ticket #402."
            />
            <AlertItem
              type="medium"
              message="Machine PB-AMB-03 has been idle for 4 hours."
              action="Contact Green Agro CHC to check for issues."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
