"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Flame,
  Zap,
  RefreshCw,
  Download,
  Shield,
  Loader2,
  Sprout,
  Timer,
  Calendar,
} from "lucide-react";

// Configuration
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
interface AnalysisResult {
  status: "CLEAN" | "BURNING" | "MACHINE_ACTIVE" | "GROWING_CROP" | "UNCLEAR";
  confidence: number;
  description: string;
  actionRequired: boolean;
  // New Fields for Harvest Prediction
  harvestEstimate: string | null; // e.g., "10-15 days"
  cropStage: string | null; // e.g., "Maturation Phase"
}

interface GeminiModel {
  name: string;
  displayName: string;
}

export default function DroneVerifier() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Model State
  const [availableModels, setAvailableModels] = useState<GeminiModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isFetchingModels, setIsFetchingModels] = useState(true);

  // ----------------------------------------------------------------------
  // 1. AUTO-DISCOVERY: Fetch available models on mount
  // ----------------------------------------------------------------------
  useEffect(() => {
    const fetchModels = async () => {
      if (!API_KEY) {
        setError("Missing API Key");
        setIsFetchingModels(false);
        return;
      }

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        // Filter for models that support content generation
        const validModels = data.models
          .filter((m: any) =>
            m.supportedGenerationMethods.includes("generateContent")
          )
          .filter((m: any) => m.name.includes("gemini"));

        const formattedModels = validModels.map((m: any) => ({
          name: m.name.replace("models/", ""),
          displayName: m.displayName || m.name,
        }));

        setAvailableModels(formattedModels);

        // Intelligent Default
        const defaultModel =
          formattedModels.find((m: any) => m.name.includes("flash-002")) ||
          formattedModels.find((m: any) => m.name.includes("flash")) ||
          formattedModels[0];

        if (defaultModel) setSelectedModel(defaultModel.name);
      } catch (err: any) {
        console.error("Model fetch error:", err);
        const fallback = "gemini-1.5-flash-latest";
        setAvailableModels([
          { name: fallback, displayName: "Flash (Fallback)" },
        ]);
        setSelectedModel(fallback);
      } finally {
        setIsFetchingModels(false);
      }
    };

    fetchModels();
  }, []);

  // Handle Image Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  // ----------------------------------------------------------------------
  // 2. MAIN ANALYSIS LOGIC (UPDATED PROMPT)
  // ----------------------------------------------------------------------
  const runAnalysis = async () => {
    if (!API_KEY) {
      setError("Missing API Key in .env.local");
      return;
    }
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
      });

      // --- THE UPDATED PROMPT FOR HARVEST PREDICTION ---
      const prompt = `
        Analyze this aerial drone image of an agricultural field.
        
        Task 1: Determine the Primary Status.
        - "BURNING": Smoke, fire, or fresh black ash visible.
        - "MACHINE_ACTIVE": Tractors/Harvesters visible working.
        - "GROWING_CROP": Standing crop visible (Green/Golden).
        - "CLEAN": Empty/Plowed field with no crop and no fire.
        
        Task 2: Harvest Prediction (Only if Status is GROWING_CROP).
        - Analyze crop color (Green vs Golden/Brown).
        - Analyze grain head maturity.
        - Estimate "days to harvest".
        
        Return ONLY valid JSON (no markdown):
        {
          "status": "CLEAN" | "BURNING" | "MACHINE_ACTIVE" | "GROWING_CROP" | "UNCLEAR",
          "confidence": number (1-100),
          "description": "Brief summary (max 15 words)",
          "actionRequired": boolean (True only for BURNING),
          "harvestEstimate": "String: e.g. '15-20 days', 'Ready for Harvest', or null if not a crop",
          "cropStage": "Vegetative" | "Maturation" | "Ready to Harvest" | null
        }
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: image.type, data: base64 } },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error?.message || `API Error: ${response.status}`
        );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No response from AI");

      const jsonStr = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsedData: AnalysisResult = JSON.parse(jsonStr);

      setResult(parsedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ---------------------------------------------------------------------- */}
      {/* 3. UI DISPLAY                                                          */}
      {/* ---------------------------------------------------------------------- */}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sprout className="text-green-600" size={32} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Crop Health & Harvest Monitor
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Dual-purpose: Detect residue burning OR estimate harvest dates.
              </p>
            </div>

            {/* Model Selector */}
            {/* <div className="flex flex-col items-end">
              <label className="text-xs text-gray-500 font-semibold mb-1 uppercase">
                AI Model
              </label>
              {isFetchingModels ? (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-2 border rounded-lg">
                  <Loader2 className="animate-spin w-3 h-3" /> Fetching...
                </div>
              ) : (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                >
                  {availableModels.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.displayName}
                    </option>
                  ))}
                </select>
              )}
            </div> */}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Area */}
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center py-8">
                <Upload className="w-12 h-12 mb-3 text-gray-400" />
                <p className="text-base font-semibold text-gray-700 mb-1">
                  Upload Field Image
                </p>
                <p className="text-sm text-gray-500">
                  Drone View Preferred (JPG/PNG)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="relative w-full h-72 bg-gray-900 rounded-lg overflow-hidden group border border-gray-200">
              <img
                src={preview}
                alt="Analysis Target"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-100"
                >
                  <RefreshCw size={16} /> Replace
                </button>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-semibold text-sm animate-pulse">
                    Running Agro-Analysis...
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {preview && !result && !loading && (
            <button
              onClick={runAnalysis}
              disabled={isFetchingModels || !selectedModel}
              className={`w-full text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 ${
                isFetchingModels || !selectedModel
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Zap size={20} /> Analyze Field Data
            </button>
          )}

          {/* ---------------------------------------------------------------------- */}
          {/* 4. DYNAMIC RESULTS CARDS                                               */}
          {/* ---------------------------------------------------------------------- */}
          {result && (
            <div className="space-y-4 animate-fadeIn">
              {/* STATUS: BURNING (Red) */}
              {result.status === "BURNING" && (
                <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="bg-red-600 p-3 rounded-full text-white">
                        <Flame size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-red-800">
                          Critical: Residue Burning
                        </h3>
                        <p className="text-red-700">{result.description}</p>
                      </div>
                    </div>
                    <span className="bg-white px-3 py-1 rounded text-red-600 font-bold border border-red-200">
                      Conf: {result.confidence}%
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-red-200 text-red-800 text-xs font-bold rounded-full animate-pulse">
                      ACTION REQUIRED
                    </span>
                  </div>
                </div>
              )}

              {/* STATUS: GROWING CROP + HARVEST PREDICTION (Teal/Green) */}
              {result.status === "GROWING_CROP" && (
                <div className="p-6 bg-teal-50 rounded-lg border-l-4 border-teal-500 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="bg-teal-600 p-3 rounded-full text-white">
                        <Sprout size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-teal-900">
                          Active Crop Detected
                        </h3>
                        <p className="text-teal-700">{result.description}</p>
                      </div>
                    </div>
                    <span className="bg-white px-3 py-1 rounded text-teal-600 font-bold border border-teal-200">
                      {result.confidence}% Match
                    </span>
                  </div>

                  {/* Harvest Estimation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t border-teal-100 pt-4">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-teal-200">
                      <Calendar className="text-teal-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">
                          Crop Stage
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {result.cropStage || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-teal-200">
                      <Timer className="text-teal-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">
                          Est. Harvest Time
                        </p>
                        <p className="text-lg font-bold text-teal-700">
                          {result.harvestEstimate || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS: CLEAN / MACHINE (Standard Blue/Green) */}
              {(result.status === "CLEAN" ||
                result.status === "MACHINE_ACTIVE") && (
                <div
                  className={`p-6 rounded-lg border-l-4 shadow-sm ${
                    result.status === "CLEAN"
                      ? "bg-green-50 border-green-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`p-3 rounded-full text-white ${
                        result.status === "CLEAN"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {result.status === "CLEAN" ? (
                        <CheckCircle size={24} />
                      ) : (
                        <Zap size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {result.status === "CLEAN"
                          ? "Field Clean / Plowed"
                          : "Machinery Active"}
                      </h3>
                      <p className="text-gray-700">{result.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS: UNCLEAR (Yellow) */}
              {result.status === "UNCLEAR" && (
                <div className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 shadow-sm flex gap-4">
                  <div className="bg-yellow-500 p-3 rounded-full text-white">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-800">
                      Analysis Inconclusive
                    </h3>
                    <p className="text-yellow-700">{result.description}</p>
                  </div>
                </div>
              )}

              {/* EXPORT DATA BUTTON */}
              <button
                onClick={() => {
                  const txt = `Status: ${result.status}\nDesc: ${result.description}\nHarvest Est: ${result.harvestEstimate}`;
                  navigator.clipboard.writeText(txt);
                  alert("Data copied to clipboard!");
                }}
                className="w-full mt-4 py-3 bg-slate-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-900 transition"
              >
                <Download size={18} /> Export Analysis Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
