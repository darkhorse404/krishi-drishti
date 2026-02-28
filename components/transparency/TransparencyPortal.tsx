import React, { useState } from 'react';
import { 
  MapPin, TrendingUp, Users, Award, Share2, ArrowRight, Search,
  Tractor, Sprout, IndianRupee, Clock, Target, Zap, Shield,
  Leaf, Phone, Mail, TrendingDown, CheckCircle, BarChart3,
  Calendar, Globe, Fuel, Factory, Building
} from 'lucide-react';

interface TransparencyPortalProps {
  stats: {
    totalMachines: number;
    farmersSupported: number;
    landCovered: number;
    stateCount: number;
    totalRevenue: number;
    averageIncome: number;
  };
  successStories: Array<{
    id: string;
    title: string;
    farmer: string;
    state: string;
    impact: string;
    imageUrl?: string;
  }>;
  news: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    description: string;
    imageUrl?: string;
  }>;
}

export const TransparencyPortal: React.FC<TransparencyPortalProps> = ({
  stats,
  successStories,
  news,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = [
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Madhya Pradesh',
    'Rajasthan',
    'Gujarat',
    'Andhra Pradesh',
    'Bihar',
    'West Bengal',
  ];

  const machineTypes = [
    { name: 'Super Seeder', count: 12500, icon: Tractor },
    { name: 'Happy Seeder', count: 8750, icon: Sprout },
    { name: 'Harvester', count: 7200, icon: Factory },
    { name: 'Zero Till Drill', count: 6800, icon: Target },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-700 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Krishi Drishti Public Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Transparency in Agriculture
            </h1>
            <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
              Real-time insights into India's agricultural machinery network. Empowering farmers through technology and transparency.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center gap-3 mb-3">
                <Tractor className="w-6 h-6 text-emerald-200" />
                <p className="text-sm text-emerald-100 font-medium">Machines</p>
              </div>
              <p className="text-4xl font-black">{(stats.totalMachines / 1000).toFixed(1)}K</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-emerald-200" />
                <p className="text-sm text-emerald-100 font-medium">Farmers</p>
              </div>
              <p className="text-4xl font-black">{(stats.farmersSupported / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-6 h-6 text-emerald-200" />
                <p className="text-sm text-emerald-100 font-medium">Acres</p>
              </div>
              <p className="text-4xl font-black">{(stats.landCovered / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-6 h-6 text-emerald-200" />
                <p className="text-sm text-emerald-100 font-medium">States</p>
              </div>
              <p className="text-4xl font-black">{stats.stateCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Fleet Overview */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Our Agricultural Fleet
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Modern machinery deployed across India to support sustainable farming practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {machineTypes.map((machine) => {
            const Icon = machine.icon;
            return (
              <div key={machine.name} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-400 transition-all duration-300 group">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition">
                  <Icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition" />
                </div>
                <p className="text-4xl font-black text-slate-900 mb-2">{machine.count.toLocaleString()}</p>
                <p className="text-lg font-semibold text-slate-600">{machine.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* National Coverage Map */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              🗺️ National Presence
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Select a state to explore regional machinery deployment and farmer impact metrics
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(selectedState === state ? null : state)}
                className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                  selectedState === state
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {state}
              </button>
            ))}
          </div>

          {selectedState && (
            <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
              <h3 className="text-3xl font-black text-slate-900 mb-6">{selectedState} Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-600 shadow">
                  <Tractor className="w-6 h-6 text-emerald-600 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold mb-1">Active Machines</p>
                  <p className="text-3xl font-black text-emerald-600">{Math.floor(Math.random() * 3000) + 1500}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border-l-4 border-blue-600 shadow">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold mb-1">Farmers Served</p>
                  <p className="text-3xl font-black text-blue-600">{(Math.floor(Math.random() * 20000) + 10000).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border-l-4 border-purple-600 shadow">
                  <MapPin className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold mb-1">Land Coverage</p>
                  <p className="text-3xl font-black text-purple-600">{(Math.random() * 3 + 1).toFixed(1)}M acres</p>
                </div>
                <div className="bg-white rounded-xl p-6 border-l-4 border-amber-600 shadow">
                  <BarChart3 className="w-6 h-6 text-amber-600 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold mb-1">Utilization</p>
                  <p className="text-3xl font-black text-amber-600">{Math.floor(Math.random() * 15) + 75}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            📊 Measurable Impact
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Data-driven insights showcasing the transformation in Indian agriculture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <IndianRupee className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Economic Growth</h3>
            <p className="text-slate-600 mb-4">₹{(stats.totalRevenue / 10000000).toFixed(0)}Cr+ revenue generated</p>
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <TrendingUp size={18} />
              <span>+35% YoY growth</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Sprout className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Crop Productivity</h3>
            <p className="text-slate-600 mb-4">45% increase in average yield</p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <CheckCircle size={18} />
              <span>60% faster harvesting</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Leaf className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sustainability</h3>
            <p className="text-slate-600 mb-4">40% water conservation</p>
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Leaf size={18} />
              <span>30% less chemicals</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Employment</h3>
            <p className="text-slate-600 mb-4">45,000+ jobs created</p>
            <div className="flex items-center gap-2 text-amber-600 font-semibold">
              <Award size={18} />
              <span>8,500+ trained operators</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Time Efficiency</h3>
            <p className="text-slate-600 mb-4">35% shorter farming cycles</p>
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <Target size={18} />
              <span>3 harvests/year possible</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Technology</h3>
            <p className="text-slate-600 mb-4">IoT-enabled real-time tracking</p>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <Shield size={18} />
              <span>AI predictive maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              🌟 Farmer Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Real testimonials from farmers who transformed their operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl overflow-hidden border-2 border-amber-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                        {story.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users size={16} />
                        <p className="text-sm font-semibold">{story.farmer}</p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <MapPin size={14} />
                        <p className="text-xs">{story.state}</p>
                      </div>
                    </div>
                    <div className="bg-amber-200 p-3 rounded-xl">
                      <Award className="w-6 h-6 text-amber-700" />
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-6 leading-relaxed">{story.impact}</p>
                  
                  <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold group-hover:gap-3 transition-all">
                    Read Full Story <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Updates */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            📰 Latest Updates
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Stay informed about new deployments and community achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-6">
              <div className="grow">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.category === 'announcement' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} />
                    <span>{item.date}</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-600 mb-4">{item.description}</p>
                <button className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about accessing our machinery network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                q: 'How can I access agricultural machinery?', 
                a: 'Register with your nearest Custom Hiring Center (CHC) through our farmer portal. Once verified, you can book machines based on availability.' 
              },
              {
                q: 'What are the rental charges?',
                a: 'Rental rates vary by machine type and duration. On average, costs range from ₹500-2,000 per day. Subsidized rates available for small-scale farmers.',
              },
              { 
                q: 'Is operator training provided?', 
                a: 'Yes! Free comprehensive training is provided for all machinery. Our certified trainers ensure you can operate equipment safely and efficiently.' 
              },
              { 
                q: 'What happens if a machine breaks down?', 
                a: '24/7 support hotline available. Our technicians respond within 2 hours, and backup machines are provided within 4 hours if needed.' 
              },
              { 
                q: 'How do I report an issue or provide feedback?', 
                a: 'Contact your CHC operator directly, use our mobile app for instant support, or call our helpline. All feedback is reviewed within 24 hours.' 
              },
              { 
                q: 'Is insurance coverage included?', 
                a: 'Yes, full insurance coverage is included in the rental package. Both machinery and crop damage protection is provided for farmer peace of mind.' 
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition">
                <h4 className="font-bold text-slate-900 mb-3 text-lg">{faq.q}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Join India's Agricultural Revolution
          </h2>
          <p className="text-xl text-emerald-50 mb-10 leading-relaxed">
            Be part of a thriving community of farmers and CHCs leveraging technology for sustainable, profitable farming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Register as Farmer
            </button>
            <button className="px-10 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-emerald-600 transition-all">
              Become a CHC Partner
            </button>
          </div>
        </div>
      </div>

      {/* Footer Contact */}
      <div className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
              <p className="text-slate-400">Our support team is available 24/7</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:1800267468" className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg transition">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold">1800-AGRI-NET</span>
              </a>
              <a href="mailto:support@krishidrishti.gov.in" className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg transition">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold">support@krishidrishti.gov.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
