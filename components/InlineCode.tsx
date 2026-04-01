export default function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-surface-green text-accent-green px-1.5 py-0.5 rounded font-mono text-sm font-semibold">
      {children}
    </code>
  );
}
