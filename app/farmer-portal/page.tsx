"use client"
import KisanSahayakBtn from '@/components/KisanSahayakBtn';
import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, MapPin, Zap, Phone, Calendar, CheckCircle, Clock, X } from 'lucide-react';
import { SidebarNav } from '@/components/sidebar-nav';

// Map component that handles Leaflet on client-side only
const FaridabadMap = dynamic(() => import('@/components/FaridabadMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-slate-200 rounded-lg flex items-center justify-center">
      <p className="text-slate-500">Loading map...</p>
    </div>
  ),
});


interface Machine {
    id: string;
    machineType: 'Super Seeder' | 'Happy Seeder' | 'Baler';
    owner: string;
    status: 'Idle / Available' | 'Working Now (Finishing Nearby)' | 'Working (Busy until 6 PM)';
    location: string;
    distance: number;
    price: number;
    nextAvailability: string;
    coords: [number, number];
}

const mockMachineList: Machine[] = [
    { id: 'HR-29-A01', machineType: 'Super Seeder', owner: 'Tigaon Kisan CHC', status: 'Working Now (Finishing Nearby)', location: 'Sector 64 Field', distance: 1.2, price: 1800, nextAvailability: 'Guaranteed for Tomorrow Morning', coords: [28.41, 77.32] },
    { id: 'HR-51-B05', machineType: 'Happy Seeder', owner: 'Sharma Agro Center', status: 'Idle / Available', location: 'Sikri Village', distance: 4.5, price: 1700, nextAvailability: 'Available Immediately', coords: [28.38, 77.35] },
    { id: 'HR-30-C12', machineType: 'Super Seeder', owner: 'Palwal Road Co-op', status: 'Working (Busy until 6 PM)', location: 'Prithla', distance: 8, price: 1800, nextAvailability: 'Available Day After Tomorrow', coords: [28.35, 77.30] },
    { id: 'HR-29-D09', machineType: 'Baler', owner: 'Green Faridabad Solutions', status: 'Idle / Available', location: 'Old Faridabad', distance: 6, price: 500, nextAvailability: 'Available Tomorrow', coords: [28.43, 77.30] },
];

const userLocation: [number, number] = [28.4089, 77.3178]; // Ballabgarh

const sortMachinesByLogistics = (userLat: number, userLng: number, machineList: Machine[]): Machine[] => {
    return [...machineList].sort((a, b) => {
        const aIsFinishingNearby = a.status === 'Working Now (Finishing Nearby)' && a.distance < 3;
        const bIsFinishingNearby = b.status === 'Working Now (Finishing Nearby)' && b.distance < 3;

        if (aIsFinishingNearby && !bIsFinishingNearby) return -1;
        if (!aIsFinishingNearby && bIsFinishingNearby) return 1;

        const aIsAvailable = a.status === 'Idle / Available';
        const bIsAvailable = b.status === 'Idle / Available';

        if (aIsAvailable && !bIsAvailable) return -1;
        if (!aIsAvailable && bIsAvailable) return 1;
        
        return a.distance - b.distance;
    });
};

const BookingModal = ({ 
    machine, 
    isOpen, 
    onClose, 
    onSubmit 
}: { 
    machine: Machine | null; 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (data: { name: string; location: string }) => void;
}) => {
    const [formData, setFormData] = useState({ name: '', location: '' });

    if (!isOpen || !machine) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', location: '' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Book Machine</h2>
                        <button 
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Enter your full name"
                                required
                                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2">
                                Your Location *
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                placeholder="Enter your field location"
                                required
                                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2">
                                Machine
                            </label>
                            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-lg text-slate-900">{machine.machineType}</p>
                                        <p className="text-sm text-slate-600">{machine.id}</p>
                                        <p className="text-sm text-slate-600">by {machine.owner}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-green-600">₹{machine.price}</p>
                                        <p className="text-xs text-slate-500">per acre</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{machine.location} ({machine.distance} km away)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 py-3"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!formData.name || !formData.location}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                            >
                                Submit Booking
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

const HarvestNudgeBanner = () => {
    const [showSMSForm, setShowSMSForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        location: ''
    });

    const handleSMSRegister = () => {
        // Handle SMS registration logic here
        console.log('SMS Registration:', formData);
        alert(`SMS registration sent! We'll contact ${formData.name} at ${formData.mobile} for ${formData.location}.`);
        setShowSMSForm(false);
        setFormData({ name: '', mobile: '', location: '' });
    };

    return (
        <Card className="bg-green-50 border-2 border-green-200 mb-6 shadow-lg">
            <CardContent className="p-4 lg:p-6">
                <div className="flex items-start gap-3 lg:gap-4">
                    <Bell className="text-green-600 h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-bold text-base lg:text-lg text-green-800">Harvest Detected!</h3>
                        <p className="text-sm lg:text-base text-green-700">We noticed you harvested your field in Tigaon, Faridabad. A Super Seeder is finishing work 1km away.</p>
                    </div>
                </div>
                
                <div className="mt-4 space-y-3">
                    {/* <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm lg:text-lg py-4 lg:py-6">
                        YES, BOOK FOR TOMORROW
                    </Button> */}
                    <KisanSahayakBtn/>
                    
                    <Button 
                        variant="outline" 
                        className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold text-sm lg:text-lg py-4 lg:py-6"
                        onClick={() => setShowSMSForm(!showSMSForm)}
                    >
                        📱 REGISTER FOR SMS UPDATES
                    </Button>
                </div>

                {showSMSForm && (
                    <Card className="mt-4 bg-white border-2 border-green-300">
                        <CardContent className="p-4">
                            <h4 className="font-bold text-green-800 mb-3">SMS Registration</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Enter your full name"
                                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                        placeholder="Enter 10-digit mobile number"
                                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none"
                                        maxLength={10}
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Location *</label>
                                    <select
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none"
                                    >
                                        <option value="">Select your area</option>
                                        <option value="Ballabgarh">Ballabgarh</option>
                                        <option value="Tigaon">Tigaon</option>
                                        <option value="Sikri Village">Sikri Village</option>
                                        <option value="Sector 64">Sector 64</option>
                                        <option value="Old Faridabad">Old Faridabad</option>
                                        <option value="Prithla">Prithla</option>
                                    </select>
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                    <Button 
                                        onClick={handleSMSRegister}
                                        disabled={!formData.name || !formData.mobile || !formData.location}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                                    >
                                        📨 Register for SMS
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowSMSForm(false)}
                                        className="flex-1 border-slate-300 text-slate-600 py-3"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};

const MachineCard = ({ machine, onBookNow }: { machine: Machine; onBookNow: (machine: Machine) => void }) => {
    const getStatusIcon = () => {
        if (machine.status.includes('Finishing Nearby')) return <Clock className="h-5 w-5 text-orange-500" />;
        if (machine.status.includes('Idle')) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (machine.status.includes('Busy')) return <Clock className="h-5 w-5 text-red-500" />;
        return null;
    };

    return (
        <Card className="mb-4 rounded-xl shadow-md border-slate-200 overflow-hidden">
            {machine.status.includes('Finishing Nearby') && (
                 <div className="bg-orange-100 text-orange-800 px-4 py-1 text-sm font-bold flex items-center gap-2">
                    <Zap size={14} /> Best Match for Tomorrow
                </div>
            )}
            <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <h3 className="font-bold text-xl text-slate-900">{machine.machineType}</h3>
                        <p className="text-sm text-slate-600">by {machine.owner}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xl text-slate-900">₹{machine.price}</p>
                        <p className="text-xs text-slate-500">per acre</p>
                    </div>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-700">
                        {getStatusIcon()}
                        <span>{machine.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <MapPin className="h-5 w-5 text-slate-500" />
                        <span>{machine.location} ({machine.distance} km away)</span>
                    </div>
                     <div className="flex items-center gap-3 text-slate-700">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <span className="font-semibold">{machine.nextAvailability}</span>
                    </div>
                </div>

                <div className="mt-5 flex gap-3">
                    <Button 
                        onClick={() => onBookNow(machine)}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white"
                    >
                        {machine.nextAvailability === 'Available Day After Tomorrow' ? 'Pre-Book' : 'Book Now'}
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> Call
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function FarmerHome() {
    const [harvestDetected, setHarvestDetected] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Super Seeder' | 'Happy Seeder' | 'Baler'>('All');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

    const sortedMachines = useMemo(() => {
        const machines = sortMachinesByLogistics(userLocation[0], userLocation[1], mockMachineList);
        if (filter === 'All') return machines;
        return machines.filter(m => m.machineType === filter);
    }, [filter]);

    const handleBookNow = (machine: Machine) => {
        setSelectedMachine(machine);
        setIsBookingModalOpen(true);
    };

    const handleBookingSubmit = (data: { name: string; location: string }) => {
        console.log('Booking submitted:', {
            ...data,
            machine: selectedMachine,
        });
        alert(`Booking confirmed!\n\nName: ${data.name}\nLocation: ${data.location}\nMachine: ${selectedMachine?.machineType} (${selectedMachine?.id})\n\nWe'll contact you shortly!`);
        setIsBookingModalOpen(false);
        setSelectedMachine(null);
    };

    // Map logic moved to FaridabadMap component

    return (
        <div className="flex">
            <SidebarNav />
            <main className="lg:ml-64 flex-1 bg-slate-50 min-h-screen pt-16 lg:pt-0">
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    <div className="mb-6 lg:mb-8">
                        <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">Farmer Portal</h1>
                        <p className="text-slate-600 mt-2 text-sm lg:text-base">Find and book agricultural machinery in Faridabad</p>
                    </div>

                    {harvestDetected && <HarvestNudgeBanner />}

                <Card className="rounded-xl shadow-lg mb-6 overflow-hidden">
                    <FaridabadMap userLocation={userLocation} machines={sortedMachines} />
                </Card>

                <div>
                    <div className="flex gap-2 lg:gap-3 mb-4 overflow-x-auto pb-2">
                        <Button onClick={() => setFilter('All')} variant={filter === 'All' ? 'default' : 'outline'} className="rounded-full text-sm lg:text-base whitespace-nowrap">All</Button>
                        <Button onClick={() => setFilter('Super Seeder')} variant={filter === 'Super Seeder' ? 'default' : 'outline'} className="rounded-full text-sm lg:text-base whitespace-nowrap">🌱 Super Seeder</Button>
                        <Button onClick={() => setFilter('Happy Seeder')} variant={filter === 'Happy Seeder' ? 'default' : 'outline'} className="rounded-full text-sm lg:text-base whitespace-nowrap">🌾 Happy Seeder</Button>
                        <Button onClick={() => setFilter('Baler')} variant={filter === 'Baler' ? 'default' : 'outline'} className="rounded-full text-sm lg:text-base whitespace-nowrap">📦 Baler</Button>
                    </div>

                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">Smart Choice</h2>
                    <div>
                        {sortedMachines.map(machine => (
                            <MachineCard key={machine.id} machine={machine} onBookNow={handleBookNow} />
                        ))}
                    </div>
                </div>

                <BookingModal
                    machine={selectedMachine}
                    isOpen={isBookingModalOpen}
                    onClose={() => {
                        setIsBookingModalOpen(false);
                        setSelectedMachine(null);
                    }}
                    onSubmit={handleBookingSubmit}
                />
                </div>
            </main>
        </div>
    );
}