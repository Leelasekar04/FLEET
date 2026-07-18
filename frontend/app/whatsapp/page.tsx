"use client";
import { useState } from "react";
import { MessageSquare, Send, Phone, Search, CheckCheck, Clock, Mic, Image as Img, Bot } from "lucide-react";

const fmt = {
  time: (d: string) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
};

type Msg = { id: string; from: "driver" | "system"; text: string; type: "text" | "image" | "audio"; at: string; processed?: boolean; amount?: number; category?: string };

const conversations = [
  {
    id: "1", driver: "Ramesh Kumar", phone: "+919876543210", trip: "TRIP-8821",
    last_msg: "Diesel 3500 at Chennai HP", last_at: "2026-07-07T12:32:00Z", unread: 2,
    messages: [
      { id: "m1", from: "driver",  type: "text",  text: "Diesel 3500 at Chennai HP pump", at: "2026-07-07T12:32:00Z", processed: true, amount: 3500, category: "Diesel" },
      { id: "m2", from: "system",  type: "text",  text: "✅ Expense recorded! ₹3,500 for Diesel at Chennai. Trip balance: ₹12,500 remaining.", at: "2026-07-07T12:32:05Z" },
      { id: "m3", from: "driver",  type: "text",  text: "Balance kitna hai", at: "2026-07-07T12:45:00Z" },
      { id: "m4", from: "system",  type: "text",  text: "📊 Your current batta balance is ₹12,500.\n\nTrip: TRIP-8821\nOpening: ₹20,000\nTotal Spent: ₹7,500\nBalance: ₹12,500", at: "2026-07-07T12:45:02Z" },
    ] as Msg[],
  },
  {
    id: "2", driver: "Suresh Babu", phone: "+919876543211", trip: "TRIP-8820",
    last_msg: "Toll paid 305", last_at: "2026-07-07T11:54:00Z", unread: 0,
    messages: [
      { id: "m1", from: "driver", type: "text",  text: "Toll paid 305 at Pune highway", at: "2026-07-07T11:54:00Z", processed: true, amount: 305, category: "Toll" },
      { id: "m2", from: "system", type: "text",  text: "✅ Toll of ₹305 recorded for TRIP-8820. Balance: ₹8,200", at: "2026-07-07T11:54:03Z" },
    ] as Msg[],
  },
  {
    id: "3", driver: "Muthu Raja", phone: "+919876543212", trip: "TRIP-8819",
    last_msg: "🎤 Voice note (0:12)", last_at: "2026-07-07T10:20:00Z", unread: 1,
    messages: [
      { id: "m1", from: "driver", type: "audio", text: "🎤 Voice note (0:12)", at: "2026-07-07T10:20:00Z", processed: true, amount: 1200, category: "Tyre Repair" },
      { id: "m2", from: "system", type: "text",  text: "✅ Tyre Repair of ₹1,200 recorded for TRIP-8819 (extracted from voice note). Balance: ₹16,800", at: "2026-07-07T10:20:05Z" },
      { id: "m3", from: "driver", type: "text",  text: "Aaj ke expenses dikhao", at: "2026-07-07T10:30:00Z" },
      { id: "m4", from: "system", type: "text",  text: "📋 Today's expenses for TRIP-8819:\n\n1. Tyre Repair — ₹1,200\n\nTotal: ₹1,200\nBalance remaining: ₹16,800", at: "2026-07-07T10:30:02Z" },
    ] as Msg[],
  },
  {
    id: "4", driver: "Arjun Singh", phone: "+919876543213", trip: "TRIP-8818",
    last_msg: "📷 Receipt photo", last_at: "2026-07-07T09:45:00Z", unread: 0,
    messages: [
      { id: "m1", from: "driver", type: "image", text: "📷 Receipt photo", at: "2026-07-07T09:45:00Z", processed: true, amount: 350, category: "Food" },
      { id: "m2", from: "system", type: "text",  text: "✅ Food expense of ₹350 extracted from receipt. Location: Coimbatore. Balance: ₹3,100", at: "2026-07-07T09:45:06Z" },
    ] as Msg[],
  },
];

export default function WhatsAppPage() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");

  const filtered = conversations.filter(c =>
    c.driver.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-4">
      {/* Conversation List */}
      <div className="w-72 flex flex-col glass-card overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={16} className="text-[#00d4aa]" />
            <h2 className="font-semibold text-white text-sm">WhatsApp Inbox</h2>
            <span className="ml-auto w-5 h-5 rounded-full bg-[#00d4aa] text-black text-[10px] font-bold flex items-center justify-center">
              {conversations.reduce((s, c) => s + c.unread, 0)}
            </span>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
            <input className="form-input pl-8 py-2 text-xs" placeholder="Search drivers..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/6">
          {filtered.map(c => (
            <button key={c.id} onClick={() => setActiveConv(c)}
              className={`w-full p-3 text-left hover:bg-white/4 transition-colors ${
                activeConv.id === c.id ? "bg-white/6" : ""
              }`}>
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4aa]/30 to-[#3b82f6]/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {c.driver.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white truncate">{c.driver}</div>
                    <div className="text-[10px] text-[#4b5563] flex-shrink-0">{fmt.time(c.last_at)}</div>
                  </div>
                  <div className="text-[10px] font-mono text-[#00d4aa] mb-0.5">{c.trip}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#6b7280] truncate">{c.last_msg}</div>
                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#00d4aa] text-black text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4aa]/30 to-[#3b82f6]/30 border border-white/10 flex items-center justify-center font-bold text-white">
            {activeConv.driver.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{activeConv.driver}</div>
            <div className="text-xs text-[#6b7280] flex items-center gap-2">
              <Phone size={10} />{activeConv.phone}
              <span className="text-[#00d4aa] font-mono">{activeConv.trip}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
            <span className="text-xs text-[#00d4aa]">Connected</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeConv.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "system" ? "justify-start" : "justify-end"}`}>
              {msg.from === "system" && (
                <div className="w-7 h-7 rounded-full bg-[#00d4aa]/15 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Bot size={13} color="#00d4aa" />
                </div>
              )}
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                msg.from === "system"
                  ? "bg-white/6 rounded-tl-none"
                  : "bg-[#00d4aa]/15 border border-[#00d4aa]/20 rounded-tr-none"
              }`}>
                {msg.type === "image" && (
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] mb-1">
                    <Img size={12} /> Photo
                  </div>
                )}
                {msg.type === "audio" && (
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] mb-1">
                    <Mic size={12} /> Voice Note
                  </div>
                )}
                <div className="text-sm text-white whitespace-pre-wrap">{msg.text}</div>
                {msg.processed && msg.amount && (
                  <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-2">
                    <span className="text-[10px] text-[#00d4aa] font-mono">AI: {msg.category} · ₹{msg.amount}</span>
                    <CheckCheck size={10} color="#00d4aa" />
                  </div>
                )}
                <div className="text-[10px] text-[#4b5563] mt-1 text-right">{fmt.time(msg.at)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply */}
        <div className="p-3 border-t border-white/8 flex gap-2">
          <input
            className="form-input flex-1 text-sm"
            placeholder="Type a message to driver..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && replyText && setReplyText("")}
          />
          <button className="btn btn-primary btn-sm">
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-56 glass-card p-4 flex flex-col gap-4">
        <div>
          <div className="text-xs text-[#6b7280] mb-2 font-semibold uppercase tracking-wide">Quick Responses</div>
          {[
            "Send balance",
            "Today's expenses",
            "Trip status",
            "Batta top-up sent",
          ].map(q => (
            <button key={q} className="w-full text-left text-xs text-[#9ca3af] hover:text-white py-1.5 px-2.5 rounded-lg hover:bg-white/6 transition-colors mb-0.5">
              {q}
            </button>
          ))}
        </div>
        <div className="border-t border-white/8 pt-4">
          <div className="text-xs text-[#6b7280] mb-2 font-semibold uppercase tracking-wide">AI Responses</div>
          <div className="space-y-2 text-xs text-[#6b7280]">
            <div className="p-2 rounded-lg bg-white/4">
              <div className="text-white font-medium mb-0.5">"balance" / "kitna hai"</div>
              Sends current batta balance
            </div>
            <div className="p-2 rounded-lg bg-white/4">
              <div className="text-white font-medium mb-0.5">"[item] [amount]"</div>
              Records expense entry
            </div>
            <div className="p-2 rounded-lg bg-white/4">
              <div className="text-white font-medium mb-0.5">Photo / Voice</div>
              AI extracts expense data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
