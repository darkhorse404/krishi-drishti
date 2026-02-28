"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  Globe,
  MapPin,
  Users,
  Tractor,
  TrendingUp,
  Award,
  Shield,
  Leaf,
  Zap,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Eye,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  Info,
  Star,
  Download,
  ExternalLink,
  Calendar,
  Target,
  Activity,
  Coins,
  PieChart,
  Building,
  Search,
  Filter,
  RefreshCw,
  IndianRupee,
  Factory,
  Sprout,
  CloudRain,
  TrendingDown,
  Users2,
  AreaChart,
  Fuel,
  Check,
} from "lucide-react";

// Indian States Data
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface PublicData {
  totalMachines: number;
  activeMachines: number;
  totalCHCs: number;
  totalFarmersServed: number;
  acresCovered: number;
  co2Reduced: number;
  sessionsCompleted: number;
  avgUtilization: number;
}

interface PanchayatPublicData {
  id: string;
  name: string;
  district: string;
  state: string;
  utilization_score: number;
  rank: number;
  total_machines: number;
  acres_covered: number;
  sessions_completed: number;
}

interface CHCData {
  id: string;
  chc_name?: string;
  name: string;
  location: string;
  district: string;
  state: string;
  total_machines?: number;
  machinery_count?: number;
  performance_rating: number;
  contact_number: string;
}

const StatCard = ({ icon, label, value, color, trend }: { icon: React.ElementType, label: string, value: string | number, color: string, trend?: string }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend.startsWith('+') ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-black text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
};


export default function PublicPortalPage() {
  const [chcs, setChcs] = useState<CHCData[]>([]);
  const [stats, setStats] = useState({
    totalChcs: 0,
    totalMachines: 0,
    activeMachines: 0,
    avgRating: 0,
  });
  const [machineStats, setMachineStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChcs, setFilteredChcs] = useState<CHCData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chcsRes, machinesRes] = await Promise.all([
          fetch("/api/custom-hiring-centres").catch(() => ({ json: () => [] })),
          fetch("/api/machines").catch(() => ({ json: () => [] })),
        ]);

        const chcsData = await chcsRes.json();
        const machinesData = await machinesRes.json();

        // Sort CHCs by rating
        const sortedChcs = (chcsData || []).sort(
          (a: CHCData, b: CHCData) =>
            b.performance_rating - a.performance_rating
        );

        setChcs(sortedChcs);
        setFilteredChcs(sortedChcs);

        const activeCount = machinesData.filter(
          (m: any) => m.status === "active"
        ).length;
        const avgRating =
          chcsData.length > 0
            ? (
                chcsData.reduce(
                  (sum: number, c: CHCData) => sum + c.performance_rating,
                  0
                ) / chcsData.length
              ).toFixed(1)
            : 0;

        // Count machines by type
        const typeBreakdown: Record<string, number> = {};
        machinesData.forEach((m: any) => {
          const typeName = m.machine_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown';
          typeBreakdown[typeName] = (typeBreakdown[typeName] || 0) + 1;
        });

        setStats({
          totalChcs: chcsData.length || 8,
          totalMachines: machinesData.length || 145,
          activeMachines: activeCount || 89,
          avgRating: Number(avgRating) || 4.6,
        });

        setMachineStats(typeBreakdown);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set fallback data
        setStats({
          totalChcs: 8,
          totalMachines: 145,
          activeMachines: 89,
          avgRating: 4.6,
        });
        setMachineStats({
          'Super Seeder': 35,
          'Happy Seeder': 28,
          'Harvester': 22,
          'Seeder': 20,
          'Baler': 18,
          'Zero Till Drill': 15,
          'Mulcher': 7
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = chcs;
    if (selectedState) {
      result = result.filter(chc => chc.state === selectedState);
    }
    if (searchQuery) {
      result = result.filter(chc => 
        chc.chc_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chc.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredChcs(result);
  }, [selectedState, searchQuery, chcs]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-emerald-600 via-teal-700 to-blue-800 text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full filter blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full filter blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
              Krishi Drishti Public Portal
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Transparency in Modern Agriculture
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
            Empowering farmers and citizens with real-time data on agricultural machinery deployment and impact.
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-20 px-4 -mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Factory} label="Total CHC Partners" value={stats.totalChcs} color="emerald" trend="+5%" />
            <StatCard icon={Tractor} label="Machines Deployed" value={stats.totalMachines} color="sky" trend="+12%" />
            <StatCard icon={Users2} label="Farmers Supported" value={`${(stats.totalMachines * 15 / 1000).toFixed(1)}k+`} color="amber" />
            <StatCard icon={AreaChart} label="Total Acres Covered" value={`${(stats.totalMachines * 120 / 1000).toFixed(0)}k+`} color="violet" />
          </div>
        </div>
      </section>

      {/* National Coverage & CHC Directory */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              CHC Directory & National Footprint
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our network of Custom Hiring Centers across India. Filter by state or search for a specific center.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="relative">
              <label htmlFor="search-chc" className="block text-sm font-medium text-slate-700 mb-2">Search CHC</label>
              <input
                id="search-chc"
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Search className="absolute left-3 top-11 w-5 h-5 text-slate-400" />
            </div>
            <div>
              <label htmlFor="state-filter" className="block text-sm font-medium text-slate-700 mb-2">Filter by State</label>
              <select
                id="state-filter"
                value={selectedState || ""}
                onChange={(e) => setSelectedState(e.target.value || null)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="">All States</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CHC Grid */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-slate-600 mt-4">Loading CHC data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredChcs.length > 0 ? filteredChcs.slice(0, 9).map((chc) => (
                <div
                  key={chc.id}
                  className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-400 transition-all duration-300 flex flex-col"
                >
                  <div className="grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                          {chc.chc_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <MapPin className="w-4 h-4" />
                          <span>{chc.district}, {chc.state}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                        <Star size={14} />
                        <span>{chc.performance_rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-slate-600 mb-6">
                       <div className="flex items-center gap-3">
                          <Tractor size={16} className="text-emerald-500"/>
                          <span><strong>{chc.machinery_count || 0}</strong> Machines</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <Phone size={16} className="text-emerald-500"/>
                          <span>{chc.contact_number}</span>
                       </div>
                    </div>
                  </div>

                  <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 group-hover:gap-3">
                    View Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )) : (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-slate-50 rounded-lg">
                  <p className="text-slate-600">No CHCs found for the selected filters.</p>
                </div>
              )}
            </div>
          )}
           {filteredChcs.length > 9 && (
              <div className="text-center mt-12">
                <button className="bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-900 transition">
                  Load More CHCs
                </button>
              </div>
            )}
        </div>
      </section>

      {/* Machine & Impact Section */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">
                Our Fleet & Environmental Impact
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                A diverse range of modern machinery is available to meet various agricultural needs, contributing to sustainable farming practices.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <Fuel className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-2xl font-bold text-slate-800">15%</p>
                  <p className="text-sm text-slate-500">Reduction in Fuel Consumption</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <Sprout className="w-8 h-8 text-green-500 mb-3" />
                  <p className="text-2xl font-bold text-slate-800">20%</p>
                  <p className="text-sm text-slate-500">Increase in Crop Yield</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                {Object.entries(machineStats).map(([type, count]) => (
                  <div key={type} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{type}</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              A Simple Process for Farmers
            </h2>
            <p className="text-lg text-slate-600">
              Accessing advanced machinery has never been easier.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 border-4 border-emerald-200">
                <Search size={32} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Find Equipment</h3>
              <p className="text-slate-600">Browse and select from our wide range of machinery.</p>
            </div>
            <div className="text-emerald-300 hidden md:block">
              <ArrowRight size={32} />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 border-4 border-emerald-200">
                <Calendar size={32} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Book a Slot</h3>
              <p className="text-slate-600">Choose a convenient time and date for your needs.</p>
            </div>
            <div className="text-emerald-300 hidden md:block">
              <ArrowRight size={32} />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 border-4 border-emerald-200">
                <Check size={32} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Get the Job Done</h3>
              <p className="text-slate-600">Our verified CHC partners deliver the service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">
                Krishi Drishti Network
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Empowering Indian farmers with modern machinery solutions
              </p>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 cursor-pointer hover:text-emerald-400" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-emerald-400" />
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/farmer-portal" className="hover:text-emerald-400 transition">
                    Farmer Portal
                  </a>
                </li>
                <li>
                  <a href="/chc-portal" className="hover:text-emerald-400 transition">
                    CHC Portal
                  </a>
                </li>
                <li>
                  <a href="/analytics" className="hover:text-emerald-400 transition">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="/map" className="hover:text-emerald-400 transition">
                    Live Map
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-6">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Partner Program
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-6">Contact</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <a
                    href="mailto:support@agritrack.com"
                    className="hover:text-emerald-400 transition"
                  >
                    support@agritrack.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <a
                    href="tel:+911800267468"
                    className="hover:text-emerald-400 transition"
                  >
                    1800-AGRI-NET
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>
              &copy; 2025 Agricultural Machinery Network. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
       <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 2rem 2rem;
        }
      `}</style>
    </div>
  );
}
