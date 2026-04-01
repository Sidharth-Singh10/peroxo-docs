import { ArrowRight, ArrowLeft, ArrowLeftRight } from "lucide-react";

interface MessageDirectionProps {
  direction: "client-to-server" | "server-to-client" | "bidirectional";
  name: string;
  status: "active" | "defined-not-handled" | "defined-not-emitted";
}

const arrows = {
  "client-to-server": ArrowRight,
  "server-to-client": ArrowLeft,
  bidirectional: ArrowLeftRight,
};

const directionLabels = {
  "client-to-server": "Client \u2192 Server",
  "server-to-client": "Server \u2192 Client",
  bidirectional: "Client \u2194 Server",
};

const statusConfig = {
  active: { label: "Active", bg: "bg-emerald-100", text: "text-emerald-800" },
  "defined-not-handled": {
    label: "Not Handled",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  "defined-not-emitted": {
    label: "Not Emitted",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
};

export default function MessageDirection({
  direction,
  name,
  status,
}: MessageDirectionProps) {
  const Icon = arrows[direction];
  const s = statusConfig[status];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="inline-flex items-center gap-2 bg-bg rounded-full px-3 py-1.5 border border-border text-sm">
        <Icon size={14} className="text-accent-rust" />
        <code className="font-mono text-sm font-medium">{name}</code>
        <span className="text-text-muted text-xs hidden sm:inline">
          {directionLabels[direction]}
        </span>
      </div>
      <span
        className={`${s.bg} ${s.text} text-xs font-medium px-2 py-0.5 rounded-full`}
      >
        {s.label}
      </span>
    </div>
  );
}
