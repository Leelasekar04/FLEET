"use client";

import { Construction, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function FleetPlaceholderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const title = slug[slug.length - 1]
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto px-4">
      <div className="w-20 h-20 bg-slate-200/50 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-slate-200">
        <Construction size={40} className="text-slate-400" />
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{title} Module</h2>
      <p className="text-slate-500 mb-8 font-medium text-[15px] leading-relaxed">
        This section of the Fleet Monitoring portal is currently being integrated with telematics providers and backend analytics.
      </p>

      <button 
        onClick={() => router.push('/fleet/vehicles')}
        className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20"
      >
        <ArrowLeft size={18} />
        Back to Vehicles
      </button>
    </div>
  );
}
