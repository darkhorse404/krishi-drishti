"use client";

import React, { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Leaf,
  Target,
  Activity,
  ChevronUp,
  ChevronDown,
  Calendar,
  Crown,
  Gift,
  Coins,
  Heart,
  CheckCircle,
  MapPin,
  Star,
  Zap,
  Clock,
  BarChart3,
  Tractor
} from "lucide-react";

// Leaderboard interfaces
interface PanchayatPerformance {
  id: string;
  name: string;
  block: string;
  district: string;
  state: string;
  utilization_score: number;
  rank: number;
  total_machines: number;
  active_machine_hours: number;
  sessions_completed: number;
  acres_covered: number;
  co2_reduced: number;
  officer_name?: string;
  officer_phone?: string;
}

interface LeaderboardData {
  top_performers: PanchayatPerformance[];
  bottom_performers: PanchayatPerformance[];
  total_panchayats: number;
  last_updated: string;
  message?: string;
}

// Faridabad Panchayat Mock Data with realistic performance metrics
const faridabadPanchayats: PanchayatPerformance[] = [
  {
    id: "panchayat-001",
    name: "Ballabhgarh",
    block: "Ballabhgarh",
    district: "Faridabad",
    state: "Haryana", 
    utilization_score: 92.5,
    rank: 1,
    total_machines: 28,
    active_machine_hours: 1240.5,
    sessions_completed: 156,
    acres_covered: 2850.5,
    co2_reduced: 145.2,
    officer_name: "Smt. Priya Sharma",
    officer_phone: "+91-9876543210"
  },
  {
    id: "panchayat-002", 
    name: "Badkhal",
    block: "Ballabhgarh",
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 89.8,
    rank: 2,
    total_machines: 24,
    active_machine_hours: 1156.8,
    sessions_completed: 142,
    acres_covered: 2650.3,
    co2_reduced: 135.8,
    officer_name: "Sh. Rajesh Kumar",
    officer_phone: "+91-9876543211"
  },
  {
    id: "panchayat-003",
    name: "Surajkund",
    block: "Ballabhgarh", 
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 87.2,
    rank: 3,
    total_machines: 22,
    active_machine_hours: 1089.2,
    sessions_completed: 134,
    acres_covered: 2480.7,
    co2_reduced: 128.4,
    officer_name: "Smt. Sunita Devi",
    officer_phone: "+91-9876543212"
  },
  {
    id: "panchayat-004",
    name: "Anangpur",
    block: "Faridabad",
    district: "Faridabad", 
    state: "Haryana",
    utilization_score: 84.6,
    rank: 4,
    total_machines: 26,
    active_machine_hours: 1025.4,
    sessions_completed: 128,
    acres_covered: 2380.5,
    co2_reduced: 122.7,
    officer_name: "Sh. Vinod Singh",
    officer_phone: "+91-9876543213"
  },
  {
    id: "panchayat-005",
    name: "Tigaon",
    block: "Faridabad",
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 82.1,
    rank: 5,
    total_machines: 20,
    active_machine_hours: 964.7,
    sessions_completed: 118,
    acres_covered: 2210.8,
    co2_reduced: 115.3,
    officer_name: "Smt. Meera Yadav",
    officer_phone: "+91-9876543214"
  },
  {
    id: "panchayat-006",
    name: "Mohna", 
    block: "Ballabhgarh",
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 79.8,
    rank: 6,
    total_machines: 18,
    active_machine_hours: 890.3,
    sessions_completed: 112,
    acres_covered: 2045.6,
    co2_reduced: 108.9,
    officer_name: "Sh. Amit Kumar",
    officer_phone: "+91-9876543215"
  },
  {
    id: "panchayat-007",
    name: "Dayalpur",
    block: "Faridabad", 
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 76.4,
    rank: 7,
    total_machines: 16,
    active_machine_hours: 845.2,
    sessions_completed: 105,
    acres_covered: 1920.4,
    co2_reduced: 102.1,
    officer_name: "Smt. Kavita Sharma",
    officer_phone: "+91-9876543216"
  },
  {
    id: "panchayat-008",
    name: "Jamalpur",
    block: "Ballabhgarh",
    district: "Faridabad",
    state: "Haryana", 
    utilization_score: 73.9,
    rank: 8,
    total_machines: 15,
    active_machine_hours: 798.5,
    sessions_completed: 98,
    acres_covered: 1820.3,
    co2_reduced: 96.7,
    officer_name: "Sh. Ravi Kant",
    officer_phone: "+91-9876543217"
  },
  {
    id: "panchayat-009", 
    name: "Kheri Kalan",
    block: "Faridabad",
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 71.2,
    rank: 9,
    total_machines: 14,
    active_machine_hours: 756.8,
    sessions_completed: 89,
    acres_covered: 1710.2,
    co2_reduced: 91.4,
    officer_name: "Smt. Pooja Devi",
    officer_phone: "+91-9876543218"
  },
  {
    id: "panchayat-010",
    name: "Lakkarpur",
    block: "Ballabhgarh",
    district: "Faridabad", 
    state: "Haryana",
    utilization_score: 68.5,
    rank: 10,
    total_machines: 12,
    active_machine_hours: 698.4,
    sessions_completed: 82,
    acres_covered: 1580.7,
    co2_reduced: 84.8,
    officer_name: "Sh. Manoj Singh",
    officer_phone: "+91-9876543219"
  },
  {
    id: "panchayat-011",
    name: "Charmwood Village",
    block: "Faridabad",
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 65.7,
    rank: 11,
    total_machines: 11,
    active_machine_hours: 642.3,
    sessions_completed: 75,
    acres_covered: 1450.5,
    co2_reduced: 78.2,
    officer_name: "Smt. Neelam Kumari",
    officer_phone: "+91-9876543220"
  },
  {
    id: "panchayat-012",
    name: "Prithla",
    block: "Ballabhgarh", 
    district: "Faridabad",
    state: "Haryana",
    utilization_score: 62.3,
    rank: 12,
    total_machines: 10,
    active_machine_hours: 589.7,
    sessions_completed: 68,
    acres_covered: 1320.8,
    co2_reduced: 71.6,
    officer_name: "Sh. Deepak Kumar",
    officer_phone: "+91-9876543221"
  }
];

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'top' | 'bottom'>('all');

  useEffect(() => {
    // Simulate API call with mock data
    const loadMockData = () => {
      try {
        const mockData: LeaderboardData = {
          top_performers: faridabadPanchayats.slice(0, 5), // Top 5 performers
          bottom_performers: faridabadPanchayats.slice(-5), // Bottom 5 performers  
          total_panchayats: faridabadPanchayats.length,
          last_updated: new Date().toISOString()
        };
        setLeaderboardData(mockData);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Leaderboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add slight delay to simulate loading
    setTimeout(loadMockData, 1000);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold">{rank}</div>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPerformanceIndicator = (score: number) => {
    if (score >= 85) return <ChevronUp className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <Activity className="w-4 h-4 text-yellow-600" />;
    return <ChevronDown className="w-4 h-4 text-red-600" />;
  };

  const getDisplayData = () => {
    if (!leaderboardData) return [];
    
    switch (selectedFilter) {
      case 'top':
        return leaderboardData.top_performers;
      case 'bottom':  
        return leaderboardData.bottom_performers;
      default:
        return faridabadPanchayats; // Show all panchayats
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-green-50">
        <SidebarNav />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-green-50">
      <SidebarNav />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-linear-to-br from-green-500 to-green-700 text-white shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
                Faridabad Panchayat Leaderboard
              </h1>
              <p className="text-slate-600 text-lg">
                CRM utilization performance rankings - Faridabad District, Haryana
              </p>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'all', label: 'All Panchayats', icon: Users },
              { key: 'top', label: 'Top Performers', icon: Trophy },
              { key: 'bottom', label: 'Needs Improvement', icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedFilter(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === key
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-green-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-600">Total Panchayats</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {faridabadPanchayats.length}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-slate-600">Top Performer</span>
              </div>
              <div className="text-lg font-bold text-slate-800">
                {faridabadPanchayats[0]?.name}
              </div>
              <div className="text-sm text-green-600 font-medium">
                {faridabadPanchayats[0]?.utilization_score.toFixed(1)}% utilization
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Tractor className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-600">Total Machines</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {faridabadPanchayats.reduce((sum, p) => sum + p.total_machines, 0)}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-600">CO₂ Reduced</span>
              </div>
              <div className="text-lg font-bold text-slate-800">
                {faridabadPanchayats.reduce((sum, p) => sum + p.co2_reduced, 0).toFixed(1)} tonnes
              </div>
              <div className="text-xs text-green-600 font-medium">
                Environmental Impact
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-600">Top Performer</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                {leaderboardData?.top_performers?.[0]?.utilization_score?.toFixed(1) || 0}%
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-slate-600">Average Score</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                {leaderboardData?.top_performers?.length ? 
                  (leaderboardData.top_performers.reduce((sum, p) => sum + p.utilization_score, 0) / leaderboardData.top_performers.length).toFixed(1) 
                  : 0}%
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span className="text-sm text-slate-600">Last Updated</span>
              </div>
              <div className="text-sm font-bold text-slate-800">
                {leaderboardData?.last_updated ? 
                  new Date(leaderboardData.last_updated).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-red-800 font-medium">Error loading leaderboard data</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {leaderboardData?.message && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-800 font-medium">System Notice</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">{leaderboardData.message}</p>
          </div>
        )}

        {/* Faridabad Panchayats Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-slate-800">
                {selectedFilter === 'all' && 'All Faridabad Panchayats'}
                {selectedFilter === 'top' && 'Top Performers'}  
                {selectedFilter === 'bottom' && 'Needs Improvement'}
              </h2>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {getDisplayData().length} Panchayats
              </span>
            </div>
            <div className="text-sm text-slate-500">
              Updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          
          <div className="overflow-hidden">
            <div className="grid gap-3">
              {getDisplayData().map((panchayat, index) => (
                <div 
                  key={panchayat.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all ${
                    panchayat.rank <= 3 
                      ? 'bg-linear-to-r from-green-50 to-emerald-50 border-green-200'
                      : panchayat.rank <= 8
                      ? 'bg-linear-to-r from-blue-50 to-cyan-50 border-blue-200' 
                      : 'bg-linear-to-r from-orange-50 to-yellow-50 border-orange-200'
                  }`}
                >
                  {/* Rank */}
                  <div className="shrink-0 w-12 text-center">
                    {panchayat.rank <= 3 ? (
                      <div className="relative">
                        {getRankIcon(panchayat.rank)}
                        {panchayat.rank === 1 && <Crown className="w-3 h-3 text-yellow-600 absolute -top-1 -right-1" />}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 text-sm flex items-center justify-center font-bold">
                        {panchayat.rank}
                      </div>
                    )}
                  </div>
                  
                  {/* Panchayat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">{panchayat.name}</h3>
                      {getPerformanceIndicator(panchayat.utilization_score)}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      Block: {panchayat.block} • District: {panchayat.district}, {panchayat.state}
                    </p>
                    {panchayat.officer_name && (
                      <p className="text-xs text-slate-500">
                        Officer: {panchayat.officer_name} • {panchayat.officer_phone}
                      </p>
                    )}
                  </div>
                  
                  {/* Metrics */}
                  <div className="hidden md:flex gap-6 text-center">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{panchayat.total_machines}</div>
                      <div className="text-xs text-slate-500">Machines</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{panchayat.sessions_completed}</div>
                      <div className="text-xs text-slate-500">Sessions</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{panchayat.acres_covered.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Acres</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{panchayat.active_machine_hours.toFixed(0)}h</div>
                      <div className="text-xs text-slate-500">Hours</div>
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <div className={`px-4 py-2 rounded-full border-2 font-bold ${getScoreColor(panchayat.utilization_score)}`}>
                      {panchayat.utilization_score.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
                      <Leaf className="w-3 h-3" />
                      {panchayat.co2_reduced}t CO₂
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-600" />
            Faridabad District Performance Insights
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Excellence Leaders
              </h4>
              <p className="text-sm text-green-700 mb-3">
                <strong>Ballabhgarh, Badkhal, and Surajkund</strong> lead with 87%+ utilization rates through 
                effective machine deployment and strong farmer engagement.
              </p>
              <div className="text-xs text-green-600 font-medium">
                • 28+ machines per panchayat<br/>
                • 140+ completed sessions<br/>
                • 2400+ acres coverage
              </div>
            </div>
            
            <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Growth Opportunities
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                <strong>Kheri Kalan, Lakkarpur, and Prithla</strong> show potential for improvement 
                with focused machinery allocation and farmer training programs.
              </p>
              <div className="text-xs text-yellow-600 font-medium">
                • Increase machine availability<br/>
                • Expand community awareness<br/>
                • Strengthen booking systems
              </div>
            </div>
            
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                District Achievements  
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Faridabad district has achieved <strong>24,000+ acres</strong> of sustainable farming 
                coverage with <strong>1,300+ tonnes CO₂</strong> reduction.
              </p>
              <div className="text-xs text-blue-600 font-medium">
                • 234 total machines deployed<br/>
                • 1,320+ successful sessions<br/>
                • 78.2% average utilization
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
