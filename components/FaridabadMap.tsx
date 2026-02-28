"use client"

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR
const DynamicMap = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-slate-200 rounded-lg flex items-center justify-center">
      <p className="text-slate-500">Loading map...</p>
    </div>
  )
}) as React.ComponentType<{
  userLocation: [number, number];
  machines: Machine[];
}>;

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

interface FaridabadMapProps {
  userLocation: [number, number];
  machines: Machine[];
}

export default function FaridabadMap({ userLocation, machines }: FaridabadMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] bg-slate-200 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">Loading map...</p>
      </div>
    );
  }

  return <DynamicMap userLocation={userLocation} machines={machines} />;
}
