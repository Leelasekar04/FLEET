"use client";

import { Construction, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function PlaceholderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  // Format the slug into a human-readable title
  const pathString = slug.join(" / ");
  const title = slug[slug.length - 1]
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto px-4">
      <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 border-2 border-amber-100 shadow-sm">
        <Construction size={40} className="text-amber-500" />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-500 mb-8 font-medium">
        The <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">/super-admin/{pathString}</span> module is currently under construction. 
        We are working hard to bring this feature to the platform soon!
      </p>

      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-200"
      >
        <ArrowLeft size={18} />
        Go Back
      </button>
    </div>
  );
}
