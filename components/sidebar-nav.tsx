"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  MapPin,
  BarChart3,
  Wrench,
  Users,
  Globe,
  AlertCircle,
  Settings,
  Sparkles,
  Menu,
  X,
  Trophy,
  Monitor,
  Award,
} from "lucide-react";
import Image from 'next/image';


const navItems = [
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/farmer-portal", label: "Farmer Portal", icon: Globe },
  { href: "/chc-portal", label: "CHC Portal", icon: Users },
  { href: "/dvs", label: "Farm Detection", icon: Monitor },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  
  { href: "/machines", label: "Machine Management", icon: Wrench },
 // { href: "/map", label: "CRM Heat Map", icon: MapPin },
  
  
  
  { href: "/transparency", label: "Public Portal", icon: Sparkles },
  { href: "/alerts", label: "Alerts", icon: AlertCircle },
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={cn(
        "w-64 h-screen fixed left-0 top-0 overflow-y-auto bg-linear-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      {/* Logo Section */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 p-2 h-10 rounded-4xl bg-gradient-to-br from-orange-500 to-green-700 flex items-center justify-center shadow-lg ">
          <Image src="/images/logo.png"
        alt="A description of the image"
        width={350} // Required for local static images
        height={200} // Required for local static images
      />
          </div>
          <div>
            <h1 className="text-xl font-bold text-orange-400 leading-tight">
              Krishi <span className="text-green-400">Drishti</span>
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-400 ml-1">
          CRM System
        </p>
      </div>

      {/* Navigation Items */}
      <div className="px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-green-500 to-green-800 text-white shadow-lg "
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {/* Hover Glass Effect */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              <Icon
                className={cn(
                  "w-5 h-5 relative z-10 transition-transform duration-300",
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white group-hover:scale-110"
                )}
              />
              <span className="font-medium text-sm relative z-10">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div className="absolute bottom-6 left-3 right-3">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-900 animate-gradient-shift" />

          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          {/* Content */}
          {/* <div className="relative p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mb-3 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              Amazing Features are
            </p>
            <p className="text-xs text-blue-100 mb-4">waiting for you</p>
            <button className="w-full py-2.5 px-4 bg-white rounded-xl text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              DISCOVER PRO
            </button>
          </div> */}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </nav>
    </>
  );
}
