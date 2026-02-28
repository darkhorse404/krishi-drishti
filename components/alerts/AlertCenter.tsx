import React, { useState } from 'react';
import { AlertCircle, Filter, Trash2, Check, X, Edit2, Clock, TrendingUp } from 'lucide-react';
import { Alert, AlertSeverity, AlertType, AlertStatus } from '@/lib/types';

interface AlertCenterProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDelete?: (alertId: string) => void;
}

const severityColors: Record<AlertSeverity, string> = {
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

const severityIcons: Record<AlertSeverity, string> = {
  low: '🔵',
  medium: '🟡',
  high: '🟠',
  critical: '🔴',
};

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warnings' | 'info'>('all');
  const [filterStatus, setFilterStatus] = useState<AlertStatus | 'all'>('all');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    let typeMatch = true;
    if (activeTab === 'critical') typeMatch = alert.severity === 'critical';
    else if (activeTab === 'warnings') typeMatch = ['high', 'medium'].includes(alert.severity);
    else if (activeTab === 'info') typeMatch = ['low'].includes(alert.severity);

    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'open').length,
    high: alerts.filter((a) => a.severity === 'high' && a.status === 'open').length,
    medium: alerts.filter((a) => a.severity === 'medium' && a.status === 'open').length,
    total: alerts.length,
  };

  return (
    <div className="space-y-6">
      {/* Alert Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-800 font-semibold">Critical</p>
          <p className="text-3xl font-bold text-red-600">{counts.critical}</p>
        </div>
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
          <p className="text-sm text-orange-800 font-semibold">High</p>
          <p className="text-3xl font-bold text-orange-600">{counts.high}</p>
        </div>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-semibold">Medium</p>
          <p className="text-3xl font-bold text-yellow-600">{counts.medium}</p>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-semibold">Total Alerts</p>
          <p className="text-3xl font-bold text-blue-600">{counts.total}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {(['all', 'critical', 'warnings', 'info'] as const).map((tab) => {
            const labels = {
              all: 'All Alerts',
              critical: '🔴 Critical',
              warnings: '⚠️ Warnings',
              info: 'ℹ️ Information',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Filter and Controls */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 flex-wrap">
          <Filter size={18} className="text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AlertStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <span className="text-sm text-gray-600 ml-auto">{filteredAlerts.length} alerts</span>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-gray-200">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-gray-50 transition">
                <div
                  onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Severity Icon */}
                    <div className="text-3xl flex-shrink-0 pt-1">{severityIcons[alert.severity]}</div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800 truncate">{alert.alert_type}</h4>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${severityColors[alert.severity]}`}
                            >
                              {alert.severity.toUpperCase()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                alert.status === 'open'
                                  ? 'bg-red-100 text-red-700'
                                  : alert.status === 'acknowledged'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : alert.status === 'resolved'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {alert.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{alert.description || alert.message}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Affected Resource */}
                      {alert.affected_resource && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Resource:</span> {alert.affected_resource}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {alert.status !== 'resolved' && (
                        <>
                          {alert.status !== 'acknowledged' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAcknowledge?.(alert.id);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                              title="Acknowledge"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onResolve?.(alert.id);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded transition"
                            title="Resolve"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(alert.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedAlert === alert.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Full Message</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>

                      {alert.description && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Details</p>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Created</p>
                          <p className="text-sm text-gray-700">{new Date(alert.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Last Updated</p>
                          <p className="text-sm text-gray-700">{new Date(alert.updated_at).toLocaleString()}</p>
                        </div>
                      </div>

                      {alert.acknowledged_at && (
                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs text-blue-700 font-semibold">
                            Acknowledged: {new Date(alert.acknowledged_at).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {alert.resolved_at && (
                        <div className="p-3 bg-green-50 rounded border border-green-200">
                          <p className="text-xs text-green-700 font-semibold">
                            Resolved: {new Date(alert.resolved_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No alerts in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Rules Configuration */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Alert Rules Configuration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
            <div>
              <p className="font-semibold text-gray-800">Underutilization Warning</p>
              <p className="text-sm text-gray-600">Trigger when machine {"<"} 20 hours/week</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              <Edit2 size={16} className="inline mr-2" />
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
            <div>
              <p className="font-semibold text-gray-800">Maintenance Due</p>
              <p className="text-sm text-gray-600">Trigger 30 days before maintenance date</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              <Edit2 size={16} className="inline mr-2" />
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
            <div>
              <p className="font-semibold text-gray-800">Low Fuel Alert</p>
              <p className="text-sm text-gray-600">Trigger when fuel level {"<"} 25%</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              <Edit2 size={16} className="inline mr-2" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
