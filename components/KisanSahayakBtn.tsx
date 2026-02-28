"use client";

import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { Phone, PhoneOff, Loader2, Mic } from "lucide-react";

const KisanSahayakButton = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);

  useEffect(() => {
    // 1. Initialize Vapi using ENV Keys
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      console.error("Missing Vapi Public Key in .env.local");
      return;
    }

    const vapi = new Vapi(publicKey);
    setVapiInstance(vapi);

    // 2. Event Listeners
    vapi.on("call-start", () => {
      setIsConnecting(false);
      setIsCallActive(true);
    });

    vapi.on("call-end", () => {
      setIsCallActive(false);
      setIsConnecting(false);
    });

    vapi.on("error", (error) => {
      console.error("Vapi Error:", error);
      setIsConnecting(false);
      setIsCallActive(false);
    });

    // Cleanup
    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const startCall = async () => {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!vapiInstance || !assistantId) {
      alert("System Error: Assistant ID missing or Vapi not initialized.");
      return;
    }

    setIsConnecting(true);
    try {
      await vapiInstance.start(assistantId);
    } catch (err) {
      console.error("Failed to start call", err);
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
    }
  };

  return (
    <div className="flex items-center gap-3 w-full mx-auto mt-6">
      
      {/* STATE 1: CALL IS ACTIVE */}
      {isCallActive && (
        <>
           {/* Listening Badge */}
           <div className="bg-black/80 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-2 animate-pulse">
              <Mic className="w-4 h-4 text-green-400" />
              <span>Listening...</span>
           </div>

           {/* End Call Button */}
           <button
             onClick={endCall}
             className="flex items-center gap-2 px-5 py-3 rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white transition-all font-bold"
           >
             <PhoneOff className="w-5 h-5" />
             <span>End Call</span>
           </button>
        </>
      )}

      {/* STATE 2: IDLE OR CONNECTING */}
      {!isCallActive && (
        <button
          onClick={startCall}
          disabled={isConnecting}
          className={`
            flex items-center text-center justify-center w-full gap-2 px-5 py-3 rounded shadow-lg transition-all font-bold text-white
            ${isConnecting 
                ? "bg-gray-500 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 active:scale-95"
            }
          `}
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              <span>YES, BOOK NOW</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default KisanSahayakButton;