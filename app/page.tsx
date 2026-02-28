"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Sprout,
  MapPin,
  Shield,
  Zap,
  Bell,
  Users,
  TrendingUp,
  Leaf,
  Radio,
  PieChart,
  Handshake,
  CheckCircle2,
  ArrowRight,
  Activity,
  Globe,
  ChevronRight,
  Award,
  Clock,
  AlertTriangle,
} from "lucide-react";

import AICTE from "../public/images/AICTE.png";
import AG from "../public/images/AG.png";

// ============ NAVBAR COMPONENT ============
function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-2 lg:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
    >
      <div className="relative bg-white/90 backdrop-blur-xl border-2 border-slate-200/80 rounded-full px-3 lg:px-6 py-3 lg:py-4 shadow-xl shadow-emerald-500/10">
        {/* Inner Glow Border */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/5 via-transparent to-orange-500/5" />

        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-1.5 lg:p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
              <Sprout className="text-white" size={20} />
            </div>
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-emerald-900 to-emerald-700 bg-clip-text text-transparent">
              Krishi Drishti
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="#home"
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#impact"
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors relative group"
            >
              Impact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/map"
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors relative group"
            >
              Live Map
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 lg:px-6 py-2 lg:py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/40 transition-all hover:scale-105 border border-orange-400/50 text-sm lg:text-base"
            >
              <span className="relative z-10">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Floating Image Frames */}
      

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-sm font-medium">
              Real-Time AI & IoT Monitoring
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Krishi 
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
                
            </span>
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
              Drishti 
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-8 lg:mb-12 leading-relaxed px-4">
            Real-time AI tracking of{" "}
            <span className="text-emerald-400 font-bold">
              3 Lakh+ CRM machines
            </span>{" "}
            to ensure{" "}
            <span className="text-emerald-400 font-bold">100% utilization</span>{" "}
            and{" "}
            <span className="text-orange-400 font-bold">
              Zero Stubble Burning
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4 px-4">
            <Link
              href="/admin"
              className="group relative px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-semibold text-base lg:text-lg shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all hover:scale-105 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Get Started
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </span>
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            </Link>

            <Link
              href=""
              className="px-6 lg:px-8 py-3 lg:py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white rounded-full font-semibold text-base lg:text-lg hover:bg-white/10 transition-all hover:scale-105 w-full sm:w-auto"
            >
              Explore More
            </Link>
          </div>

          {/* Collaboration Logos */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16"
          >
            <p className="text-slate-400 text-sm mb-6 text-center">
              In Collaboration With
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-4 hover:bg-white/15 transition-all">
                <div className="text-white font-bold text-xl tracking-wider">
                  AICTE
                </div>
              </div> */}
              {/* <div></div>
              <div className="h-12 w-px bg-white/20" />
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-4 hover:bg-white/15 transition-all">
                <div className="text-white font-bold text-xl tracking-wider">
                  SIH 2024
                </div>
              </div>
            </div>
          </motion.div> */}

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: "Active Machines", value: "3L+", icon: Activity },
              {
                label: "Coverage Area",
                value: "190+",
                suffix: "Districts",
                icon: MapPin,
              },
              { label: "CO₂ Saved", value: "500+", suffix: "Tons", icon: Leaf },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <stat.icon className="text-emerald-400 mb-3" size={32} />
                <div className="text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-400">
                  {stat.suffix || stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-emerald-400/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-emerald-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

// ============ TICKER SECTION ============
function PulseTicker() {
  const stats = [
    { label: "Punjab", value: "92% Utilization", icon: "🟢" },
    { label: "Haryana", value: "450 Active Machines", icon: "🚜" },
    { label: "UP", value: "CO₂ Saved: 500 Tons", icon: "🌍" },
    { label: "Rajasthan", value: "87% Utilization", icon: "🟢" },
    { label: "MP", value: "320 Active Machines", icon: "🚜" },
  ];

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 py-5 overflow-hidden border-y-2 border-emerald-500">
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...stats, ...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 text-white">
            <span className="text-2xl">{stat.icon}</span>
            <span className="font-bold text-lg">{stat.label}:</span>
            <span className="text-emerald-100">{stat.value}</span>
            <span className="text-emerald-300">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ============ BENTO GRID FEATURES ============
function BentoFeatures() {
  const features = [
    {
      title: "Real-Time Telematics",
      description:
        "GPS-enabled tracking of every CRM machine with live location updates and route history",
      icon: Radio,
      size: "large",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Subsidy Accountability",
      description: "100% transparent fund allocation and usage tracking",
      icon: PieChart,
      size: "tall",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Farmer Connect",
      description:
        "Direct booking system connecting farmers with available machinery",
      icon: Handshake,
      size: "small",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "AI-Driven Alerts",
      description:
        "Intelligent notifications for maintenance, idle machines, and optimization opportunities",
      icon: Bell,
      size: "wide",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200">
              Core Features
            </span>
          </div>
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Built for <span className="text-emerald-600">Bharat</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive platform combining cutting-edge technology with
            grassroots accessibility
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`
                relative flex grid-cols-2 group cursor-pointer rounded-3xl overflow-hidden bg-white border-2 border-slate-200 hover:border-emerald-300 shadow-lg hover:shadow-2xl transition-all
              `}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
              />

              <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
                <div className="flex-1">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3 line-clamp-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed line-clamp-3 md:line-clamp-4">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all mt-4 pt-4 border-t border-slate-100">
                  Learn more{" "}
                  <ChevronRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ HOW IT WORKS TIMELINE ============
function HowItWorks() {
  const steps = [
    {
      title: "IoT Device Sends Signal",
      description:
        "GPS-enabled telematics device transmits real-time location and operational data via cellular network",
      icon: Radio,
      color: "emerald",
    },
    {
      title: "Panchayat Verifies Usage",
      description:
        "Local authorities validate machine deployment and work completion through mobile app",
      icon: CheckCircle2,
      color: "blue",
    },
    {
      title: "Farmer Receives Service",
      description:
        "Agricultural residue management completed efficiently with zero cost to the farmer",
      icon: Users,
      color: "orange",
    },
    {
      title: "Environment Breathes Clean",
      description:
        "Stubble incorporated into soil, preventing air pollution and preserving soil health",
      icon: Leaf,
      color: "green",
    },
  ];

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-64 h-64 border-2 border-emerald-200 rounded-full" />
        <div className="absolute bottom-20 left-20 w-64 h-64 border-2 border-orange-200 rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200">
              Process Flow
            </span>
          </div>
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A seamless flow from technology to environmental impact
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-green-500 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const [isHovered, setIsHovered] = React.useState(false);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative flex gap-8 items-start"
                >
                  {/* Icon */}
                  <div
                    className={`shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center shadow-xl z-20 relative ring-4 ring-white`}
                  >
                    <step.icon className="text-white" size={28} />
                  </div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex-1 bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <motion.span
                        className={`text-4xl font-bold transition-colors duration-300 ${
                          isHovered ? "text-emerald-500" : "text-slate-200"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </motion.span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ STATS SECTION ============
function ImpactStats() {
  const stats = [
    { value: "3,00,000+", label: "Machines Tracked", icon: Activity },
    { value: "190+", label: "Districts Covered", icon: MapPin },
    { value: "500+", label: "Tons CO₂ Saved", icon: Leaf },
    { value: "99.2%", label: "Uptime", icon: TrendingUp },
    { value: "10,000+", label: "Farmers Served", icon: Users },
    { value: "₹50Cr+", label: "Subsidy Tracked", icon: Shield },
  ];

  return (
    <section
      id="impact"
      className="py-32 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Decorative Glow Effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-semibold border border-emerald-500/20">
              Real-Time Impact
            </span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">
            Impact That <span className="text-emerald-400">Matters</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real numbers, real change across rural India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-emerald-500/30 rounded-3xl p-8 hover:bg-white/10 transition-all group overflow-hidden"
            >
              {/* Inner Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-300" />

              <div className="relative">
                <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <stat.icon
                    className="text-emerald-400 group-hover:scale-110 transition-transform"
                    size={32}
                  />
                </div>
                <div className="text-5xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-lg">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ LEADERBOARD ============
function LeaderboardSection() {
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        setLeaderboard(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 mb-6 shadow-lg">
            <Award className="text-yellow-600" size={20} />
            <span className="text-sm font-semibold text-yellow-700 tracking-wide uppercase">
              Public Accountability
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Panchayat Performance{" "}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrating excellence in agricultural mechanization and farmer
            service delivery
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-600 border-t-transparent" />
          </div>
        ) : leaderboard ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  🏆 Top Performers
                </h3>
              </div>
              <div className="space-y-4">
                {leaderboard.top_performers?.map(
                  (panchayat: any, index: number) => (
                    <motion.div
                      key={panchayat.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-400 shadow-lg shadow-yellow-200"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-200 to-gray-50 border-gray-400 shadow-lg shadow-gray-200"
                          : "bg-gradient-to-br from-orange-100 to-orange-50 border-orange-400 shadow-lg shadow-orange-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">
                              {getMedalIcon(index + 1)}
                            </span>
                            <h4 className="text-lg font-bold text-gray-900">
                              {panchayat.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {panchayat.district}, {panchayat.state}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-600">
                            <span>📍 {panchayat.total_sessions} sessions</span>
                            <span>
                              🌾 {panchayat.total_acres_covered.toFixed(1)}{" "}
                              acres
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">
                            {panchayat.utilization_score}
                          </div>
                          <p className="text-xs text-gray-500">score</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            {/* Bottom Performers (Needs Improvement) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  ⚠️ Needs Improvement
                </h3>
              </div>
              <div className="space-y-4">
                {leaderboard.bottom_performers?.map(
                  (panchayat: any, index: number) => (
                    <motion.div
                      key={panchayat.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl border-2 bg-gradient-to-br from-red-50 to-white border-red-200 hover:border-red-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-red-600">
                              #{panchayat.rank}
                            </span>
                            <h4 className="text-lg font-bold text-gray-900">
                              {panchayat.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {panchayat.district}, {panchayat.state}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-600">
                            <span>📍 {panchayat.total_sessions} sessions</span>
                            <span>
                              🌾 {panchayat.total_acres_covered.toFixed(1)}{" "}
                              acres
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-red-600">
                            {panchayat.utilization_score}
                          </div>
                          <p className="text-xs text-gray-500">score</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No leaderboard data available
          </p>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-gray-200 shadow-lg">
            <Clock className="text-gray-500" size={16} />
            <p className="text-sm text-gray-600">
              Updated:{" "}
              <span className="font-semibold text-gray-900">
                {leaderboard?.last_updated
                  ? new Date(leaderboard.last_updated).toLocaleString()
                  : "N/A"}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-16 border-t-2 border-emerald-500/20 relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-2 rounded-xl shadow-lg shadow-emerald-500/30">
                <Sprout className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold">Krishi Drishti</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Empowering Indian agriculture through technology, transparency,
              and sustainable practices. A Smart India Hackathon initiative for
              zero stubble burning.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
              <Globe size={18} />
              <span className="font-semibold text-sm">Made in India 🇮🇳</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Live Map", "Analytics", "Impact Report"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-emerald-400 group-hover:w-4 transition-all duration-300" />
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Portal Access</h3>
            <ul className="space-y-3">
              {[
                { name: "Admin Login", href: "/admin" },
                { name: "CHC Portal", href: "/chc-portal" },
                { name: "Public Portal", href: "/public-portal" },
                { name: "Transparency", href: "/transparency" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-emerald-400 group-hover:w-4 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 Krishi Drishti. Ministry of Agriculture & Farmers Welfare,
            Government of India.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function LandingPage() {
  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <PulseTicker />
      <BentoFeatures />
      <HowItWorks />
      <ImpactStats />
      <LeaderboardSection />
      <Footer />
    </div>
  );
}
