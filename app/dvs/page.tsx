"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import DroneVerifier from "@/components/dvs/DroneVerifier";
import { Leaf, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export default function DVSPage() {
  return (
    <div className="flex">
      <SidebarNav />
      <main className="ml-64 flex-1 bg-slate-50 min-h-screen p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <Leaf className="text-green-600" size={36} />
            Drone Verification System
          </h1>
          <p className="text-slate-600 mt-2">
            AI-powered crop residue detection to monitor and minimize stubble
            burning
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  Burning Detected
                </h3>
                <p className="text-sm text-gray-600">
                  Immediate alert system for crop residue burning activities
                  with high confidence scoring
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  Field Compliance
                </h3>
                <p className="text-sm text-gray-600">
                  Verify that agricultural fields meet environmental burning
                  standards and regulations
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <HelpCircle className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  Smart Detection
                </h3>
                <p className="text-sm text-gray-600">
                  Advanced AI analysis detects burning, machinery activity, and
                  generates clear compliance reports
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Component */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <DroneVerifier />
        </div>

        {/* Guidelines Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">How to Use</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-green-600 flex-shrink-0">
                  1.
                </span>
                <span>
                  Upload a clear drone frame image of the agricultural field
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600 flex-shrink-0">
                  2.
                </span>
                <span>
                  Ensure good lighting and clear visibility of the field area
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600 flex-shrink-0">
                  3.
                </span>
                <span>Click "Start Analysis" to process the image with AI</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600 flex-shrink-0">
                  4.
                </span>
                <span>Review the detection results and confidence scores</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600 flex-shrink-0">
                  5.
                </span>
                <span>
                  Export or share results for compliance documentation
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Result Interpretation
            </h3>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-bold text-red-700">Burning Detected</p>
                <p className="text-gray-600">
                  Crop residue burning confirmed. Alert will be triggered for
                  immediate action.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-bold text-green-700">Field Clean</p>
                <p className="text-gray-600">
                  No burning detected. Field is compliant with environmental
                  standards.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-bold text-blue-700">Machinery Active</p>
                <p className="text-gray-600">
                  Active agricultural machinery detected. No burning activity
                  observed.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-bold text-yellow-700">Unclear Detection</p>
                <p className="text-gray-600">
                  Image quality or conditions unclear. Manual review
                  recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
