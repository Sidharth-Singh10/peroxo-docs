"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPrevNext } from "@/lib/navigation";

export default function PrevNextNav() {
  const pathname = usePathname();
  const { prev, next } = getPrevNext(pathname);

  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-rust transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-rust transition-colors"
        >
          <span>{next.title}</span>
          <ArrowRight size={16} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
