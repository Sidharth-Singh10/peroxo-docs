import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get API Keys — Peroxo",
  description:
    "Sign in with Google and generate your Peroxo project credentials.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
