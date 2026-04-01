import { Info, AlertTriangle, XCircle } from "lucide-react";
import type { ReactNode } from "react";

interface CalloutProps {
  variant: "info" | "warning" | "danger";
  title?: string;
  children: ReactNode;
}

const config = {
  info: {
    icon: Info,
    border: "border-l-[#3B82F6]",
    bg: "bg-blue-50",
    iconColor: "text-[#3B82F6]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-l-[#F48C06]",
    bg: "bg-orange-50",
    iconColor: "text-[#F48C06]",
  },
  danger: {
    icon: XCircle,
    border: "border-l-[#EF4444]",
    bg: "bg-red-50",
    iconColor: "text-[#EF4444]",
  },
};

export default function Callout({ variant, title, children }: CalloutProps) {
  const { icon: Icon, border, bg, iconColor } = config[variant];

  return (
    <div
      className={`${bg} ${border} border-l-4 rounded-r-lg p-4 my-4`}
    >
      <div className="flex gap-3">
        <Icon size={20} className={`${iconColor} mt-0.5 shrink-0`} />
        <div className="min-w-0">
          {title && (
            <p className="font-semibold text-text mb-1">{title}</p>
          )}
          <div className="text-text/80 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
