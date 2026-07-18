"use client";
import { Calculator } from "lucide-react";
import { useEffect, useState } from "react";

export default function AccountantTopBar() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("accountant_profile");
    if (storedProfile) {
      try { setProfile(JSON.parse(storedProfile)); } catch(e){}
    }
  }, []);

  return (
    <header className="topbar">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-bold text-slate-800">Finance & Accounting</div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-none">{profile?.name || "Accountant"}</div>
              <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-1">{profile?.role || "Finance Team"}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow-sm font-bold text-sm">
              <Calculator size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
