import Link from "next/link";
import { Truck, Building2, ArrowRight } from "lucide-react";

export default function PortalSelector() {
  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-20 bg-[radial-gradient(circle,rgba(0,212,170,0.8),transparent_70%)] blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-15 bg-[radial-gradient(circle,rgba(59,130,246,0.8),transparent_70%)] blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        
        {/* Subtle Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg mx-auto">
        
        {/* Header / Brand */}
        <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-500 cursor-default">
          <div className="inline-flex items-center justify-center gap-4 mb-6 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#3b82f6] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,170,0.4)]">
              <Truck size={24} color="#000" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white leading-none tracking-tight">
                FleetManager <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4aa] to-[#3b82f6]">Pro</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold mt-1">
                Command Center
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Select your portal below to access real-time operations, analytics, and fleet controls.
          </p>
        </div>

        {/* Login Card */}
        <Link href="/dashboard" className="group block w-full outline-none">
          <div className="relative overflow-hidden rounded-[2rem] p-[2px] transition-all duration-500 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)]">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 group-hover:from-[#00d4aa] group-hover:via-[#3b82f6] group-hover:to-[#00d4aa] transition-colors duration-500 opacity-50 group-hover:opacity-100" />
            
            {/* Inner Card Content */}
            <div className="relative bg-[#0A101C]/90 backdrop-blur-xl rounded-[calc(2rem-2px)] p-8 sm:p-10 h-full flex flex-col items-center text-center transition-all duration-500 group-hover:bg-[#0A101C]/70">
              
              {/* Background Glow inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/10 rounded-full blur-[60px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150 group-hover:bg-[#3b82f6]/20" />
              
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center mb-6 shadow-xl group-hover:border-[#3b82f6]/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-500">
                <Building2 size={36} className="text-slate-300 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#3b82f6] transition-all duration-500">
                Fleet Admin Portal
              </h2>
              
              <p className="text-slate-400 mb-10 text-base leading-relaxed max-w-sm">
                Manage your drivers, dispatch vehicles, track expenses, and view real-time telematics data.
              </p>
              
              <div className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm w-full max-w-[240px] group-hover:bg-gradient-to-r group-hover:from-[#00d4aa] group-hover:to-[#3b82f6] group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-[#3b82f6]/50">
                <span>Enter Dashboard</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>
        
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </div>
  );
}
