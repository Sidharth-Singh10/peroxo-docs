import Link from "next/link";
import {
  Zap,
  Shield,
  MessageSquare,
  Users,
  History,
  BarChart3,
} from "lucide-react";
import StepFlow from "@/components/StepFlow";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Zap,
    title: "Sub-Millisecond Routing",
    description:
      "Actor-based message router with zero mutex locks. Every message is delivered through sequential channel processing — no lock contention at any scale.",
  },
  {
    icon: Shield,
    title: "Multi-Tenant Isolation",
    description:
      "Every user is scoped to a project_id. Tenant data is fully isolated at the protocol level, not just the database level.",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description:
      'Send and receive direct messages with delivery acknowledgments. Track message state from "sending" to "persisted" with client_message_id correlation.',
  },
  {
    icon: Users,
    title: "Room Messaging",
    description:
      "Create rooms, broadcast messages to all members, and let the server handle fan-out. Room membership is automatically cleaned up on disconnect.",
  },
  {
    icon: History,
    title: "History & Sync",
    description:
      "Cursor-based pagination for loading older messages. On reconnect, sync missed messages with a single request per conversation.",
  },
  {
    icon: BarChart3,
    title: "Built-in Observability",
    description:
      "Prometheus metrics endpoint out of the box. Pre-built Grafana dashboard for WebSocket connections, message throughput, and latency.",
  },
];

const howItWorksSteps = [
  {
    title: "Authenticate",
    description:
      "Mint a short-lived token using your project credentials. Tokens last 10 minutes and are stored in Redis.",
  },
  {
    title: "Connect",
    description:
      "Open a WebSocket to Peroxo with your token. The server verifies it and registers your session.",
  },
  {
    title: "Chat",
    description:
      "Send and receive JSON messages in real time. Direct messages, rooms, history, and sync — all over a single WebSocket.",
  },
];

const heroSnippet = `{ "SendDirectMessage": { "conversation_id": "conv-abc", "to": { "project_id": "peroxo_pj_x7k", "user_id": "alice" }, "content": "Hello!", "client_message_id": "550e8400-..." } }`;

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #B7410E 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, #E85D04 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight text-text max-w-3xl">
            Real-time messaging infrastructure,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #B7410E 0%, #E85D04 50%, #F48C06 100%)",
              }}
            >
              forged in Rust.
            </span>
          </h1>
          <p className="mt-6 text-lg text-text-muted max-w-2xl leading-relaxed">
            Peroxo is a high-performance WebSocket messaging backend with
            actor-based routing, sub-millisecond delivery, and zero lock
            contention. Integrate real-time chat into your app in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/docs/overview"
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #B7410E 0%, #E85D04 50%, #F48C06 100%)",
              }}
            >
              Get Started
            </Link>
            <a
              href="https://github.com/Sidharth-Singh10/PerOXO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium border border-accent-rust text-accent-rust hover:bg-surface-accent transition-colors"
            >
              View on GitHub
            </a>
          </div>
          <div className="mt-10 max-w-3xl rounded-xl overflow-hidden border border-white/10">
            <div className="bg-[#181825] text-text-code/70 text-xs font-mono px-4 py-2">
              WebSocket message
            </div>
            <pre className="bg-bg-code text-text-code text-sm font-mono p-4 overflow-x-auto leading-relaxed">
              {heroSnippet}
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text">
            Everything you need for real-time messaging
          </h2>
          <p className="text-center text-text-muted mt-3 max-w-xl mx-auto">
            From one-on-one chats to room broadcasts, Peroxo handles the
            hard parts so you can focus on your product.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "#B7410E0A" }}
                >
                  <f.icon size={20} className="text-accent-rust" />
                </div>
                <h3 className="font-semibold text-text">{f.title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 px-6 bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text">
            Architecture
          </h2>
          <p className="text-center text-text-muted mt-3 max-w-xl mx-auto">
            Your client talks to two services — the Auth Service over HTTPS and
            the Peroxo Gateway over WebSocket. Everything else is internal.
          </p>
          <ArchitectureDiagram />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            How It Works
          </h2>
          <p className="text-text-muted mt-3">
            Three steps from zero to real-time messaging.
          </p>
          <div className="mt-8">
            <StepFlow steps={howItWorksSteps} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
