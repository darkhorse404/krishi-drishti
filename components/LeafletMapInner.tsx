"use client"

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

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

interface LeafletMapInnerProps {
  userLocation: [number, number];
  machines: Machine[];
}

export default function LeafletMapInner({ userLocation, machines }: LeafletMapInnerProps) {
  const getStatusColor = (status: string) => {
    if (status.includes('Finishing Nearby')) return 'text-orange-600';
    if (status.includes('Idle')) return 'text-green-600';
    if (status.includes('Busy')) return 'text-red-600';
    return 'text-blue-600';
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('Finishing Nearby')) return '🟠';
    if (status.includes('Idle')) return '🟢';
    if (status.includes('Busy')) return '🔴';
    return '🔵';
  };

  // Create markers for all machines in the URL
  const allMarkers = [
    `${userLocation[0]},${userLocation[1]}`, // User location (blue)
    ...machines.map(machine => `${machine.coords[0]},${machine.coords[1]}`)
  ].join('|');

  // Create satellite map URL using Google Maps satellite view
  const mapUrl = `https://maps.google.com/maps?q=${userLocation[0]},${userLocation[1]}&t=k&z=12&output=embed`;

  return (
    <div className="h-[300px] w-full bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 relative">
      {/* Static Map Header */}
      <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span className="text-sm font-semibold">Faridabad Agricultural Machinery Map (Satellite View)</span>
        </div>
        <span className="text-xs">🔵 Your Location</span>
      </div>
      
      {/* Map Content */}
      <div className="h-[calc(100%-40px)] relative">
        {/* Embedded Satellite Map */}
        <iframe 
          src={mapUrl}
          className="w-full h-full border-0"
          title="Faridabad Satellite Map"
          loading="lazy"
        />
        
        {/* Machine Position Overlays - Positioned based on actual coordinates */}
        <div className="absolute inset-0 pointer-events-none">
          {/* User Location Marker - Ballabgarh coordinates (28.4089, 77.3178) */}
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"
            style={{ 
              left: `${((userLocation[1] - 77.2178) / (77.4178 - 77.2178)) * 100}%`, 
              top: `${100 - ((userLocation[0] - 28.3089) / (28.5089 - 28.3089)) * 100}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
            title="Your Location - Ballabgarh"
          />
          
          {/* Machine Markers - Positioned based on their actual coordinates */}
          {machines.map((machine) => {
            const leftPercent = ((machine.coords[1] - 77.2178) / (77.4178 - 77.2178)) * 100;
            const topPercent = 100 - ((machine.coords[0] - 28.3089) / (28.5089 - 28.3089)) * 100;
            
            return (
              <div 
                key={machine.id}
                className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                  machine.status.includes('Finishing Nearby') ? 'bg-orange-500' :
                  machine.status.includes('Idle') ? 'bg-green-500' :
                  machine.status.includes('Busy') ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ 
                  left: `${Math.max(5, Math.min(95, leftPercent))}%`, 
                  top: `${Math.max(5, Math.min(95, topPercent))}%`, 
                  transform: 'translate(-50%, -50%)' 
                }}
                title={`${machine.machineType} - ${machine.location} - ${machine.status}`}
              />
            );
          })}
        </div>
        
        {/* Machine Info Overlay */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-[200px] border pointer-events-auto">
          <h4 className="text-xs font-bold text-slate-700 mb-2">Machine Locations</h4>
          
          {/* Legend */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
              <span>Finishing Nearby</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full border border-white"></div>
              <span>Available Now</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full border border-white"></div>
              <span>Busy</span>
            </div>
          </div>
          
          {/* Nearby Machines */}
          <div className="space-y-1">
            {machines.slice(0, 2).map((machine) => (
              <div key={machine.id} className="text-xs flex items-center gap-2">
                <span className="text-sm">{getStatusIcon(machine.status)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{machine.machineType}</p>
                  <p className="text-slate-600 truncate">{machine.distance}km away</p>
                </div>
              </div>
            ))}
            {machines.length > 2 && (
              <p className="text-xs text-slate-500 mt-2">+{machines.length - 2} more machines</p>
            )}
          </div>
          
          <div className="mt-3 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Navigation size={12} />
              <span>Ballabgarh, Faridabad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
