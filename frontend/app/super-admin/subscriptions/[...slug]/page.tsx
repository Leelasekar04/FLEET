"use client";

import { Construction, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function SubscriptionsPlaceholderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const title = slug[slug.length - 1]
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-2xl mx-auto px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
        <Construction size={32} className="text-slate-400" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-2">{title} Module</h2>
      <p className="text-slate-500 mb-8 font-medium">
        This section of the Billing & Subscriptions portal is currently being integrated with our payment processor.
      </p>

      <button 
        onClick={() => router.push('/super-admin/subscriptions/analytics')}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md shadow-slate-200"
      >
        <ArrowLeft size={16} />
        Back to Analytics
      </button>
    </div>
  );
}
