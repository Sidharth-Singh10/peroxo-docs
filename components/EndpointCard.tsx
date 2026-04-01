"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface EndpointCardProps {
  method: "GET" | "POST" | "WS";
  path: string;
  description: string;
  children?: ReactNode;
}

const methodColors: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-800",
  POST: "bg-blue-100 text-blue-800",
  WS: "bg-purple-100 text-purple-800",
};

export default function EndpointCard({
  method,
  path,
  description,
  children,
}: EndpointCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl my-4 overflow-hidden bg-bg-card">
      <div className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`${methodColors[method]} px-2.5 py-1 rounded-md text-xs font-bold font-mono`}
          >
            {method}
          </span>
          <code className="bg-surface-green text-accent-green px-1.5 py-0.5 rounded text-sm font-mono font-semibold break-all">{path}</code>
        </div>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
      </div>
      {children && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border text-sm text-text-muted hover:bg-bg/50 transition-colors cursor-pointer"
          >
            <span>{open ? "Hide details" : "Show details"}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="px-4 pb-4 border-t border-border">{children}</div>
          )}
        </>
      )}
    </div>
  );
}
