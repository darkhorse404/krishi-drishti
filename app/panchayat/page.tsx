"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Award,
  MapPin,
  Users,
  Tractor,
  FileCheck,
  XCircle,
} from "lucide-react";
import type { Panchayat, UtilizationSession, Complaint } from "@/lib/types";

interface PanchayatStats {
  total_sessions: number;
  pending_verifications: number;
  total_complaints: number;
  open_complaints: number;
  utilization_score: number;
  rank: number;
  total_panchayats: number;
}

export default function PanchayatDashboard() {
  const [panchayat, setPanchayat] = useState<Panchayat | null>(null);
  const [stats, setStats] = useState<PanchayatStats | null>(null);
  const [pendingSessions, setPendingSessions] = useState<UtilizationSession[]>(
    []
  );
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual user context to get panchayat_id
      const panchayat_id = "mock-panchayat-id";

      const [panchayatRes, sessionsRes, complaintsRes] = await Promise.all([
        fetch(`/api/panchayats/${panchayat_id}`),
        fetch(`/api/panchayats/${panchayat_id}/sessions?status=pending`),
        fetch(`/api/panchayats/${panchayat_id}/complaints`),
      ]);

      const panchayatData = await panchayatRes.json();
      const sessionsData = await sessionsRes.json();
      const complaintsData = await complaintsRes.json();

      setPanchayat(panchayatData.panchayat);
      setStats(panchayatData.stats);
      setPendingSessions(sessionsData.sessions);
      setComplaints(complaintsData.complaints);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifySession = async (session_id: string, approved: boolean) => {
    try {
      await fetch(`/api/sessions/${session_id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved, verified_by: "panchayat-officer" }),
      });

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to verify session:", error);
    }
  };

  const updateComplaintStatus = async (
    complaint_id: string,
    status: string
  ) => {
    try {
      await fetch(`/api/complaints/${complaint_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Failed to update complaint:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!panchayat) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Panchayat not found</p>
      </div>
    );
  }

  const rankMedal =
    stats?.rank === 1
      ? "🥇"
      : stats?.rank === 2
      ? "🥈"
      : stats?.rank === 3
      ? "🥉"
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-6 w-6 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  {panchayat.name}
                </h1>
                {rankMedal && <span className="text-3xl">{rankMedal}</span>}
              </div>
              <p className="text-gray-600">
                {panchayat.block} Block, {panchayat.district} District,{" "}
                {panchayat.state}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <Users className="inline h-4 w-4 mr-1" />
                Population: {panchayat.population.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Utilization Score</span>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {stats?.utilization_score || 0}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Rank: #{stats?.rank || "-"} of {stats?.total_panchayats || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-2 border-blue-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_sessions || 0}
                </p>
              </div>
              <Tractor className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 border-2 border-orange-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Verifications</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats?.pending_verifications || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4 border-2 border-purple-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_complaints || 0}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4 border-2 border-red-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Complaints</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats?.open_complaints || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Session Verification Queue */}
        <Card className="p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Session Verification Queue ({pendingSessions.length})
            </h2>
          </div>

          {pendingSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending sessions to verify
            </p>
          ) : (
            <div className="space-y-4">
              {pendingSessions.map((session) => (
                <div
                  key={session.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Session #{session.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Farmer:</span>{" "}
                        {session.farmer_name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span>{" "}
                        {session.start_time
                          ? new Date(session.start_time).toLocaleString()
                          : "Unknown"}{" "}
                        -{" "}
                        {session.end_time
                          ? new Date(session.end_time).toLocaleString()
                          : "Ongoing"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Area Covered:</span>{" "}
                        {session.acres_covered || "N/A"} acres
                      </p>
                      {session.subsidy_amount && (
                        <p className="text-sm text-green-600 font-medium">
                          Subsidy: ₹{session.subsidy_amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => verifySession(session.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => verifySession(session.id, false)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Complaint Inbox */}
        <Card className="p-6 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Complaint Inbox ({complaints.length})
            </h2>
          </div>

          {complaints.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No complaints received
            </p>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            complaint.status === "RESOLVED"
                              ? "default"
                              : complaint.status === "UNDER_REVIEW"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {complaint.status}
                        </Badge>
                        <Badge variant="outline">
                          {complaint.complaint_type}
                        </Badge>
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {complaint.farmer_name}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {complaint.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Filed: {new Date(complaint.created_at).toLocaleString()}
                      </p>
                    </div>
                    {complaint.status === "SUBMITTED" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            updateComplaintStatus(complaint.id, "UNDER_REVIEW")
                          }
                          size="sm"
                          variant="outline"
                        >
                          Review
                        </Button>
                        <Button
                          onClick={() =>
                            updateComplaintStatus(complaint.id, "RESOLVED")
                          }
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
