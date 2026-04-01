import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-muted">
        <span
          className="font-bold text-lg bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #B7410E 0%, #E85D04 50%, #F48C06 100%)",
          }}
        >
          Peroxo
        </span>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Sidharth-Singh10/PerOXO"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            GitHub
          </a>
          <Link
            href="/docs/overview"
            className="hover:text-text transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/docs/api-reference"
            className="hover:text-text transition-colors"
          >
            API Reference
          </Link>
        </div>

        <span>Built with Rust, Tokio, and Axum</span>
      </div>
    </footer>
  );
}
