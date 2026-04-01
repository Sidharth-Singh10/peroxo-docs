export default function ArchitectureDiagram() {
  return (
    <div className="my-10 overflow-x-auto">
      <div className="min-w-[640px] flex flex-col items-center gap-6 py-6">
        <div className="flex items-center gap-0 w-full max-w-3xl justify-center">
          <Box label="Client App" sublabel="Your Frontend" variant="default" />
          <Arrow label="WebSocket" bidirectional />
          <Box
            label="Peroxo Gateway"
            sublabel="Axum + Actors"
            variant="accent"
          />
          <Arrow label="gRPC" bidirectional />
          <Box label="Chat Service" sublabel="ScyllaDB" variant="default" />
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-border" />
            <span className="text-xs text-text-muted my-1">gRPC</span>
            <div className="w-0.5 h-4 bg-border" />
            <Box label="Auth Service" sublabel="Redis + PG" variant="default" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Box({
  label,
  sublabel,
  variant,
}: {
  label: string;
  sublabel: string;
  variant: "default" | "accent";
}) {
  const isAccent = variant === "accent";
  return (
    <div
      className={`rounded-xl border-2 px-5 py-4 text-center min-w-[150px] ${
        isAccent
          ? "border-accent-rust bg-surface-accent"
          : "border-border bg-bg-card"
      }`}
    >
      <div
        className={`font-semibold text-sm ${isAccent ? "text-accent-rust" : "text-text"}`}
      >
        {label}
      </div>
      <div className="text-xs text-text-muted mt-0.5">{sublabel}</div>
    </div>
  );
}

function Arrow({
  label,
  bidirectional,
}: {
  label: string;
  bidirectional?: boolean;
}) {
  return (
    <div className="flex flex-col items-center mx-2 shrink-0">
      <span className="text-[10px] text-text-muted mb-1">{label}</span>
      <div className="flex items-center text-text-muted">
        {bidirectional && <span className="text-xs">{"\u25C0"}</span>}
        <div className="w-12 h-0.5 bg-border mx-0.5" />
        <span className="text-xs">{"\u25B6"}</span>
      </div>
    </div>
  );
}
