"use client";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: string;
  trend?: { value: string; up: boolean };
  delay?: number;
  href?: string;
}

export default function KPICard({
  title, value, subtitle, icon: Icon, accent = "#00d4aa", trend, delay = 0, href,
}: KPICardProps) {
  const content = (
    <div
      className={`kpi-card animate-fade-in ${href ? "hover:cursor-pointer" : ""}`}
      style={{
        "--card-accent": accent,
        animationDelay: `${delay}ms`,
      } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
        >
          <Icon size={18} color={accent} strokeWidth={2} />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-lg"
            style={{
              background: trend.up ? "rgba(0,212,170,0.15)" : "rgba(239,68,68,0.15)",
              color: trend.up ? "#00d4aa" : "#f87171",
            }}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );

  return href ? (
    <Link href={href} className="block outline-none">
      {content}
    </Link>
  ) : (
    content
  );
}
