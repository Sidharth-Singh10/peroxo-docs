"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="py-6 px-4 space-y-6">
      {navigation.map((group) => (
        <div key={group.title}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 px-3">
            {group.title}
          </h3>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-surface-accent border-l-2 border-accent-rust font-semibold text-accent-rust"
                        : "text-text-muted hover:text-text hover:bg-bg"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-bg-card border border-border rounded-lg shadow-sm"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-60 bg-bg-card border-r border-border overflow-y-auto transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="lg:hidden flex justify-end p-3">
          <button onClick={() => setOpen(false)} aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}
