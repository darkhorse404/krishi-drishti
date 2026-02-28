import React, { useState } from 'react';
import { Calendar, Clock, TrendingUp, Users, AlertCircle, CheckCircle, MapPin, Phone } from 'lucide-react';
import { Machine, Booking, UsageLog, MaintenanceRecord } from '@/lib/types';

interface CHCOperatorDashboardProps {
  chcName: string;
  machines: Machine[];
  bookings: Booking[];
  usageLogs: UsageLog[];
  maintenanceRecords: MaintenanceRecord[];
  stats: {
    totalMachines: number;
    activeMachines: number;
    occupancyRate: number;
    revenueThisMonth: number;
    performanceRating: number;
  };
}

export const CHCOperatorDashboard: React.FC<CHCOperatorDashboardProps> = ({
  chcName,
  machines,
  bookings,
  usageLogs,
  maintenanceRecords,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'machines' | 'bookings' | 'activity' | 'maintenance'>('overview');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to {chcName}</h1>
        <p className="text-blue-100 mb-6">Manage your agricultural machinery efficiently</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-blue-100 text-sm mb-1">Total Machines</p>
            <p className="text-3xl font-bold">{stats.totalMachines}</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-blue-100 text-sm mb-1">Active Now</p>
            <p className="text-3xl font-bold text-green-300">{stats.activeMachines}</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-blue-100 text-sm mb-1">Occupancy Rate</p>
            <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-blue-100 text-sm mb-1">This Month Revenue</p>
            <p className="text-3xl font-bold">₹{(stats.revenueThisMonth / 100000).toFixed(1)}L</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {(['overview', 'machines', 'bookings', 'activity', 'maintenance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Dashboard */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">⭐ Performance Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-yellow-500">{stats.performanceRating.toFixed(1)}</span>
                      <span className="text-gray-600">out of 5.0</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                        style={{ width: `${(stats.performanceRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-4xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < Math.floor(stats.performanceRating) ? '⭐' : '☆'}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Pending Bookings</h4>
                    <Calendar className="text-green-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Requiring attention</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Maintenance Due</h4>
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-red-600">{maintenanceRecords.length}</p>
                  <p className="text-sm text-gray-600 mt-2">Upcoming services</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'machines' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Machine Inventory</h3>
              <div className="space-y-3">
                {machines.map((machine) => (
                  <div key={machine.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                          {machine.machine_type === 'baler'
                            ? '🌾'
                            : machine.machine_type === 'harvester'
                              ? '🚜'
                              : '🌱'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{machine.id}</p>
                          <p className="text-sm text-gray-600">{machine.registration_number}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Hours Used</p>
                        <p className="font-semibold text-gray-800">{machine.total_hours} hrs</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          machine.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : machine.status === 'idle'
                              ? 'bg-yellow-100 text-yellow-800'
                              : machine.status === 'maintenance'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {machine.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Management</h3>
              <div className="space-y-3">
                {bookings.length > 0 ? (
                  bookings.map((booking, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">{booking.farmer_name}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Phone size={14} />
                            {booking.farmer_contact}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-semibold">Machine</p>
                          <p className="text-gray-800">{booking.machine_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Date</p>
                          <p className="text-gray-800">{new Date(booking.start_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Area</p>
                          <p className="text-gray-800">{booking.land_area} acres</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Cost</p>
                          <p className="text-gray-800 font-semibold">₹{(booking.estimated_cost / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No bookings available</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Activity Timeline</h3>
              <div className="space-y-3">
                {usageLogs.length > 0 ? (
                  usageLogs.slice(0, 10).map((log, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{log.farmer_name}</p>
                            <p className="text-sm text-gray-600">{log.machine_id}</p>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(log.start_time).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {log.area_covered} acres • {log.fuel_consumed}L fuel • {log.village}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No activity logs</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 Maintenance Schedule</h3>
              <div className="space-y-3">
                {maintenanceRecords.length > 0 ? (
                  maintenanceRecords.map((record, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{record.machine_id}</p>
                          <p className="text-sm text-gray-600">{record.service_type}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">₹{(record.cost / 1000).toFixed(1)}K</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{new Date(record.service_date).toLocaleDateString()}</span>
                        {record.next_due_date && (
                          <span className="text-orange-600 font-semibold">
                            Next: {new Date(record.next_due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No maintenance records</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
