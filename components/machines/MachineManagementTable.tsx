import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Plus, Edit2, Trash2, Eye, MoreHorizontal, Filter, Download } from 'lucide-react';
import { Machine, MachineStatus, MachineType } from '@/lib/types';

interface MachineTableProps {
  machines: Machine[];
  loading?: boolean;
  onEdit?: (machine: Machine) => void;
  onDelete?: (machineId: string) => void;
  onView?: (machine: Machine) => void;
  onAdd?: () => void;
  onBulkDelete?: (machineIds: string[]) => void;
}

const statusColors: Record<MachineStatus, string> = {
  active: 'bg-green-100 text-green-800',
  idle: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-red-100 text-red-800',
  offline: 'bg-gray-100 text-gray-800',
};

const machineTypeIcons: Record<MachineType, string> = {
  baler: '🌾',
  harvester: '🚜',
  seeder: '🌱',
  tiller: '🛠️',
  mulcher: '⚙️',
  happy_seeder: '🌱',
  zero_till_drill: '🛠️',
};

export const MachineManagementTable: React.FC<MachineTableProps> = ({
  machines,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onBulkDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachines, setSelectedMachines] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<MachineStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<MachineType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'id' | 'status' | 'utilization'>('id');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filter and sort machines
  const filteredMachines = useMemo(() => {
    let result = machines.filter((m) => {
      const matchSearch =
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.registration_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || m.status === filterStatus;
      const matchType = filterType === 'all' || m.machine_type === filterType;
      return matchSearch && matchStatus && matchType;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'id') return a.id.localeCompare(b.id);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'utilization') return (b.utilization_rate || 0) - (a.utilization_rate || 0);
      return 0;
    });

    return result;
  }, [machines, searchTerm, filterStatus, filterType, sortBy]);

  const handleSelectAll = () => {
    if (selectedMachines.size === filteredMachines.length) {
      setSelectedMachines(new Set());
    } else {
      setSelectedMachines(new Set(filteredMachines.map((m) => m.id)));
    }
  };

  const handleSelectMachine = (machineId: string) => {
    const newSelected = new Set(selectedMachines);
    if (newSelected.has(machineId)) {
      newSelected.delete(machineId);
    } else {
      newSelected.add(machineId);
    }
    setSelectedMachines(newSelected);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header with controls */}
      <div className="p-4 lg:p-6 border-b border-gray-200 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Machine Fleet</h2>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={onAdd}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm lg:text-base flex-1 lg:flex-initial"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Machine</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm lg:text-base flex-1 lg:flex-initial">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as MachineStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as MachineType | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="baler">Baler</option>
            <option value="harvester">Harvester</option>
            <option value="seeder">Seeder</option>
            <option value="tiller">Tiller</option>
            <option value="mulcher">Mulcher</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'id' | 'status' | 'utilization')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="id">Sort by ID</option>
            <option value="status">Sort by Status</option>
            <option value="utilization">Sort by Utilization</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredMachines.length} of {machines.length} machines
          </span>
          {selectedMachines.size > 0 && (
            <button
              onClick={() => {
                onBulkDelete?.(Array.from(selectedMachines));
                setSelectedMachines(new Set());
              }}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Delete Selected ({selectedMachines.size})
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedMachines.size === filteredMachines.length && filteredMachines.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Machine ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Utilization</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fuel Level</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMachines.map((machine) => (
              <React.Fragment key={machine.id}>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMachines.has(machine.id)}
                      onChange={() => handleSelectMachine(machine.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{machineTypeIcons[machine.machine_type]}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{machine.id}</p>
                        <p className="text-sm text-gray-500">{machine.registration_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700 capitalize">{machine.machine_type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[machine.status]}`}>
                      {machine.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${machine.utilization_rate > 80 ? 'bg-green-500' : machine.utilization_rate > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${machine.utilization_rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-8">{machine.utilization_rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full ${machine.fuel_level > 50 ? 'bg-green-500' : machine.fuel_level > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      />
                      <span className="text-sm font-medium text-gray-700">{machine.fuel_level}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{machine.current_location?.district || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView?.(machine)}
                        className="p-2 hover:bg-blue-100 rounded transition"
                        title="View details"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => onEdit?.(machine)}
                        className="p-2 hover:bg-yellow-100 rounded transition"
                        title="Edit"
                      >
                        <Edit2 size={18} className="text-yellow-600" />
                      </button>
                      <button
                        onClick={() => onDelete?.(machine.id)}
                        className="p-2 hover:bg-red-100 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === machine.id && (
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-semibold">Total Hours</p>
                          <p className="text-gray-800">{machine.total_hours} hrs</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Fuel Efficiency</p>
                          <p className="text-gray-800">{machine.fuel_efficiency} L/hr</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">CHC ID</p>
                          <p className="text-gray-800">{machine.chc_id}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Operator</p>
                          <p className="text-gray-800">{machine.operator_id || 'Unassigned'}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {filteredMachines.map((machine) => (
          <div key={machine.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedMachines.has(machine.id)}
                  onChange={() => handleSelectMachine(machine.id)}
                  className="rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{machine.id}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{machineTypeIcons[machine.machine_type] || '🚜'}</span>
                    <span className="text-sm text-gray-600 capitalize">{machine.machine_type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[machine.status]}`}
                >
                  {machine.status}
                </span>
                <button
                  onClick={() => setExpandedRow(expandedRow === machine.id ? null : machine.id)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 block">Location</span>
                <span className="text-gray-800">{machine.district}, {machine.state}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Utilization</span>
                <span className="text-gray-800">{machine.utilization_rate || 0}%</span>
              </div>
            </div>
            
            {expandedRow === machine.id && (
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 block">Registration</span>
                    <span className="text-gray-800">{machine.registration_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Operator</span>
                    <span className="text-gray-800">{machine.operator_id || 'Unassigned'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-3">
                  <button
                    onClick={() => onView?.(machine)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 transition flex-1 justify-center"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => onEdit?.(machine)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100 transition flex-1 justify-center"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(machine.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition flex-1 justify-center"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No machines found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
