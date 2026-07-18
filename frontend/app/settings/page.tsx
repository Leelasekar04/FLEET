"use client";
import { useState } from "react";
import {
  Settings, Building2, GitBranch, Users, Shield, Bell, Globe,
  Plus, Edit2, Trash2, Check, Truck, CreditCard,
} from "lucide-react";

const ROLES = ["Fleet Owner", "Branch Manager", "Accountant", "Dispatcher"];
const MODULES = ["Vehicles", "Drivers", "Trips", "Expenses", "Batta", "Ledger", "Reports", "Compliance"];
const PERMISSIONS = ["View", "Create", "Edit", "Delete", "Approve", "Export"];

const mockUsers = [
  { id: "1", name: "Rajan Kumar",     role: "Fleet Owner",    branch: "Chennai HQ",   email: "rajan@fleet.com",   status: "active" },
  { id: "2", name: "Priya S",         role: "Accountant",     branch: "Chennai HQ",   email: "priya@fleet.com",   status: "active" },
  { id: "3", name: "Suresh M",        role: "Dispatcher",     branch: "Bangalore",    email: "suresh@fleet.com",  status: "active" },
  { id: "4", name: "Meena R",         role: "Branch Manager", branch: "Hyderabad",    email: "meena@fleet.com",   status: "inactive" },
];

const mockBranches = [
  { id: "1", name: "Chennai HQ",  city: "Chennai",   state: "TN", manager: "Rajan Kumar", drivers: 5, vehicles: 6 },
  { id: "2", name: "Bangalore",   city: "Bengaluru", state: "KA", manager: "Suresh M",    drivers: 3, vehicles: 4 },
  { id: "3", name: "Hyderabad",   city: "Hyderabad", state: "TS", manager: "Meena R",     drivers: 2, vehicles: 2 },
];

type SettingsTab = "company" | "branches" | "users" | "roles" | "notifications" | "integrations" | "billing";

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("company");
  const [addUserModal, setAddUserModal] = useState(false);
  const [permMatrix, setPermMatrix] = useState<Record<string, boolean>>({});

  const togglePerm = (role: string, module: string, perm: string) => {
    const key = `${role}:${module}:${perm}`;
    setPermMatrix((m: Record<string, boolean>) => ({ ...m, [key]: !m[key] }));
  };

  const navItems: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
    { key: "company",       label: "Company",       icon: Building2 },
    { key: "branches",      label: "Branches",      icon: GitBranch },
    { key: "users",         label: "Users",         icon: Users },
    { key: "roles",         label: "Roles & Permissions", icon: Shield },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "integrations",  label: "Integrations",  icon: Globe },
    { key: "billing",       label: "Billing & Plan", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#9ca3af] mt-0.5">Company configuration, users, roles & integrations</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-52 flex-shrink-0">
          <div className="glass-card p-2 space-y-0.5">
            {navItems.map(n => (
              <button key={n.key} onClick={() => setTab(n.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  tab === n.key ? "bg-[#00d4aa]/15 text-[#00d4aa]" : "text-[#9ca3af] hover:text-white hover:bg-white/4"
                }`}>
                <n.icon size={15} />
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Company */}
          {tab === "company" && (
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Building2 size={16} className="text-[#00d4aa]" /> Company Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Company Name *",    placeholder: "Kumar Transport Co.",   key: "name",    def: "Kumar Transport Co." },
                  { label: "GST Number",         placeholder: "33AABCK1234A1Z5",     key: "gst",     def: "33AABCK1234A1Z5" },
                  { label: "PAN Number",         placeholder: "AABCK1234A",          key: "pan",     def: "AABCK1234A" },
                  { label: "Phone",              placeholder: "+91 98765 43210",      key: "phone",   def: "+91 98765 43210" },
                  { label: "Email",              placeholder: "admin@kumartransport.com", key: "email", def: "admin@kumartransport.com" },
                  { label: "City",               placeholder: "Chennai",              key: "city",    def: "Chennai" },
                  { label: "State",              placeholder: "Tamil Nadu",           key: "state",   def: "Tamil Nadu" },
                  { label: "Pincode",            placeholder: "600001",               key: "pincode", def: "600001" },
                ].map(f => (
                  <div key={f.key} className={f.key === "name" ? "col-span-2" : ""}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" defaultValue={f.def} placeholder={f.placeholder} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="form-label">Address</label>
                  <textarea className="form-input h-16 resize-none" defaultValue="42, Transport Nagar, Chennai - 600001" />
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {/* Branches */}
          {tab === "branches" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="btn btn-primary btn-sm"><Plus size={13} /> Add Branch</button>
              </div>
              {mockBranches.map(b => (
                <div key={b.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center">
                    <GitBranch size={17} color="#3b82f6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{b.name}</div>
                    <div className="text-xs text-[#6b7280]">{b.city}, {b.state} · Manager: {b.manager}</div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-[#6b7280]">
                    <div><span className="font-semibold text-white">{b.drivers}</span> Drivers</div>
                    <div><span className="font-semibold text-white">{b.vehicles}</span> Vehicles</div>
                  </div>
                  <button className="btn btn-secondary btn-sm"><Edit2 size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="btn btn-primary btn-sm" onClick={() => setAddUserModal(true)}>
                  <Plus size={13} /> Add User
                </button>
              </div>
              <div className="glass-card overflow-hidden">
                <table className="data-table">
                  <thead><tr>
                    <th>User</th><th>Role</th><th>Branch</th><th>Status</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {mockUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#00d4aa]/20 flex items-center justify-center text-xs font-bold text-[#00d4aa]">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{u.name}</div>
                              <div className="text-xs text-[#6b7280]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{
                            background: u.role === "Fleet Owner" ? "#00d4aa15" : "#3b82f615",
                            color:      u.role === "Fleet Owner" ? "#00d4aa"   : "#60a5fa",
                            border: `1px solid ${u.role === "Fleet Owner" ? "#00d4aa30" : "#3b82f630"}`,
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td><span className="text-sm text-[#9ca3af]">{u.branch}</span></td>
                        <td>
                          <span className={`badge ${u.status === "active" ? "badge-active" : "badge-inactive"}`}>{u.status}</span>
                        </td>
                        <td>
                          <div className="flex gap-1.5">
                            <button className="btn btn-secondary btn-sm"><Edit2 size={11} /></button>
                            <button className="btn btn-danger btn-sm"><Trash2 size={11} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Roles & Permissions Matrix */}
          {tab === "roles" && (
            <div className="glass-card p-5 overflow-x-auto">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[#00d4aa]" /> Permission Matrix
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4 text-[#6b7280] font-medium">Module</th>
                    {ROLES.map(r => (
                      <th key={r} colSpan={PERMISSIONS.length}
                        className="text-center px-1 py-2 text-[#9ca3af] font-medium border-l border-white/8">
                        {r}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th />
                    {ROLES.map(r => PERMISSIONS.map(p => (
                      <th key={`${r}:${p}`} className="text-center py-1 px-1 text-[9px] text-[#4b5563] font-normal">{p}</th>
                    )))}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((mod, mi) => (
                    <tr key={mod} className={mi % 2 === 0 ? "bg-white/2" : ""}>
                      <td className="py-2 pr-4 text-[#9ca3af] font-medium whitespace-nowrap">{mod}</td>
                      {ROLES.map(role => PERMISSIONS.map(perm => {
                        const key = `${role}:${mod}:${perm}`;
                        // Fleet Owner gets all; others get limited defaults
                        const defaultOn = role === "Fleet Owner" ||
                          (role === "Branch Manager" && ["View", "Create"].includes(perm)) ||
                          (role === "Accountant" && perm === "View") ||
                          (role === "Dispatcher" && perm === "View" && ["Trips", "Drivers"].includes(mod));
                        const isOn = key in permMatrix ? permMatrix[key] : defaultOn;
                        return (
                          <td key={`${role}:${mod}:${perm}`} className="text-center py-2 px-1">
                            <button
                              onClick={() => togglePerm(role, mod, perm)}
                              className={`w-5 h-5 rounded flex items-center justify-center mx-auto transition-all ${
                                isOn ? "bg-[#00d4aa]/20 border border-[#00d4aa]/40" : "bg-white/4 border border-white/10"
                              }`}>
                              {isOn && <Check size={10} color="#00d4aa" />}
                            </button>
                          </td>
                        );
                      }))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button className="btn btn-primary">Save Permissions</button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === "notifications" && (
            <div className="glass-card p-6 space-y-5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Bell size={16} className="text-[#00d4aa]" /> Notification Preferences
              </h2>
              {[
                { label: "Expense Recorded",       sub: "When a driver submits an expense",        whatsapp: true,  email: true,  push: false },
                { label: "Low Batta Balance",       sub: "When balance drops below ₹2,000",        whatsapp: true,  email: false, push: true },
                { label: "Trip Completed",          sub: "When driver ends a trip",                 whatsapp: true,  email: true,  push: true },
                { label: "Document Expiry (30d)",   sub: "30 days before document expires",         whatsapp: false, email: true,  push: false },
                { label: "Document Expiry (7d)",    sub: "7 days before document expires",          whatsapp: true,  email: true,  push: true },
                { label: "Expense Pending Approval",sub: "When expense awaits manager approval",    whatsapp: false, email: true,  push: false },
                { label: "Settlement Required",     sub: "When trip ends with outstanding balance", whatsapp: true,  email: true,  push: true },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-white/6">
                  <div>
                    <div className="text-sm font-medium text-white">{n.label}</div>
                    <div className="text-xs text-[#6b7280]">{n.sub}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    {[
                      { key: "whatsapp", label: "WhatsApp", val: n.whatsapp },
                      { key: "email",    label: "Email",    val: n.email },
                      { key: "push",     label: "Push",     val: n.push },
                    ].map(ch => (
                      <label key={ch.key} className="flex items-center gap-1.5 cursor-pointer">
                        <div className={`w-8 h-4 rounded-full relative transition-all cursor-pointer ${ch.val ? "bg-[#00d4aa]" : "bg-white/15"}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${ch.val ? "right-0.5" : "left-0.5"}`} />
                        </div>
                        <span className="text-[#6b7280]">{ch.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button className="btn btn-primary">Save Preferences</button>
              </div>
            </div>
          )}

          {/* Integrations */}
          {tab === "integrations" && (
            <div className="space-y-4">
              {[
                { name: "WhatsApp Business API", sub: "Meta Business · Webhook connected", status: "connected", color: "#25D366" },
                { name: "Gemini AI (Google)",     sub: "AI expense extraction · 2.0 Flash", status: "connected", color: "#4285F4" },
                { name: "Supabase Database",      sub: "PostgreSQL · Real-time enabled",   status: "connected", color: "#3ECF8E" },
                { name: "Google Maps API",        sub: "GPS tracking & route mapping",      status: "not_setup", color: "#DB4437" },
                { name: "Razorpay",               sub: "Subscription billing · India",      status: "not_setup", color: "#072654" },
                { name: "Tally Export",           sub: "XML export for Tally ERP",          status: "not_setup", color: "#1a1a1a" },
              ].map(intg => (
                <div key={intg.name} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${intg.color}20`, border: `1px solid ${intg.color}30` }}>
                    <Globe size={17} color={intg.color} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{intg.name}</div>
                    <div className="text-xs text-[#6b7280]">{intg.sub}</div>
                  </div>
                  <span className={`badge ${intg.status === "connected" ? "badge-active" : ""}`}
                    style={intg.status !== "connected" ? { background: "#6b728015", color: "#9ca3af", border: "1px solid #6b728030" } : {}}>
                    {intg.status === "connected" ? "✓ Connected" : "Not Setup"}
                  </span>
                  <button className="btn btn-secondary btn-sm">
                    {intg.status === "connected" ? "Manage" : "Configure"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Billing */}
          {tab === "billing" && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-xs text-[#6b7280] mb-0.5">Current Plan</div>
                    <div className="text-2xl font-bold gradient-text">Pro Plan</div>
                    <div className="text-sm text-[#9ca3af]">₹2,999 / month · Renews Aug 1, 2026</div>
                  </div>
                  <button className="btn btn-primary btn-sm">Upgrade</button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Drivers", used: 8, max: 100 },
                    { label: "Vehicles", used: 6, max: 100 },
                    { label: "Branches", used: 3, max: 5 },
                    { label: "Storage", used: 1.2, max: 50, suffix: "GB" },
                  ].map(u => (
                    <div key={u.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#9ca3af]">{u.label}</span>
                        <span className="text-white">{u.used}/{u.max}{u.suffix || ""}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-[#00d4aa]"
                          style={{ width: `${(u.used / u.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { plan: "Basic",      price: "₹999",  features: ["20 Drivers", "20 Vehicles", "1 Branch", "5GB Storage"],       color: "#6b7280" },
                  { plan: "Pro",        price: "₹2,999", features: ["100 Drivers", "100 Vehicles", "5 Branches", "50GB Storage"],  color: "#00d4aa", current: true },
                  { plan: "Enterprise", price: "₹9,999", features: ["Unlimited", "Unlimited", "50 Branches", "500GB Storage"],     color: "#8b5cf6" },
                ].map(p => (
                  <div key={p.plan} className={`glass-card p-5 ${p.current ? "border-[#00d4aa]/40" : "border-white/8"}`}>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: p.color }}>{p.plan}</div>
                    <div className="text-2xl font-bold text-white mb-3">{p.price}<span className="text-sm font-normal text-[#6b7280]">/mo</span></div>
                    <ul className="space-y-1 mb-4">
                      {p.features.map(f => (
                        <li key={f} className="text-xs text-[#9ca3af] flex items-center gap-1.5">
                          <Check size={11} color={p.color} />{f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full btn btn-sm justify-center ${p.current ? "btn-primary" : "btn-secondary"}`}>
                      {p.current ? "Current Plan" : "Switch Plan"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {addUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={16} className="text-[#00d4aa]" /> Add User
              </h2>
              <button className="text-[#6b7280] hover:text-white text-xl" onClick={() => setAddUserModal(false)}>×</button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name *",    placeholder: "e.g. Priya Sharma" },
                { label: "Email Address *", placeholder: "priya@fleet.com" },
                { label: "Phone (WhatsApp)", placeholder: "+91 98765 43210" },
              ].map(f => (
                <div key={f.label}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="form-label">Role *</label>
                <select className="form-input">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Branch</label>
                <select className="form-input">
                  <option>Chennai HQ</option><option>Bangalore</option><option>Hyderabad</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn btn-secondary flex-1" onClick={() => setAddUserModal(false)}>Cancel</button>
              <button className="btn btn-primary flex-1">Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
