"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Copy, Check, Loader2, KeyRound } from "lucide-react";
import Callout from "@/components/Callout";

function decodeEmail(jwt: string): string | null {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return payload.email ?? null;
  } catch {
    return null;
  }
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg hover:bg-black/5 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check size={16} className="text-accent-green" />
      ) : (
        <Copy size={16} className="text-text-muted" />
      )}
    </button>
  );
}

export default function GetApiKeysPage() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [keys, setKeys] = useState<{
    project_id: string;
    secret_api_key: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = idToken ? decodeEmail(idToken) : null;

  const handleGenerate = async () => {
    if (!idToken) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://auth.mutref.tech/generate-tenant",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      } else if (res.status === 401) {
        setError("Your session has expired. Please sign in again.");
        setIdToken(null);
        setKeys(null);
      } else if (res.status === 429) {
        setError(
          "You've reached the limit of 3 key generations per hour. Please try again later."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    setKeys(null);
    setError(null);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-text">Get Your API Keys</h1>

      {error && (
        <Callout variant="danger">{error}</Callout>
      )}

      {/* State 1: Not signed in */}
      {!idToken && !keys && (
        <>
          <p className="mt-4 text-text-muted leading-relaxed">
            Sign in with your Google account to provision your Peroxo project
            credentials. You&apos;ll receive a <strong>project ID</strong> and a{" "}
            <strong>secret API key</strong> that your backend uses to
            authenticate with the Peroxo Auth Service.
          </p>
          <div className="mt-8">
            <GoogleLogin
              onSuccess={(response: CredentialResponse) => {
                setIdToken(response.credential ?? null);
                setError(null);
              }}
              onError={() => {
                setError("Google sign-in failed. Please try again.");
              }}
            />
          </div>
        </>
      )}

      {/* State 2: Signed in, ready to generate */}
      {idToken && !keys && (
        <>
          <p className="mt-4 text-text-muted leading-relaxed">
            Signed in as <strong className="text-text">{email}</strong>
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 inline-flex items-center gap-2 text-white font-semibold rounded-lg px-6 py-3 transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
            style={{ background: "var(--gradient-rust)" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <KeyRound size={18} />
                Generate API Keys
              </>
            )}
          </button>
        </>
      )}

      {/* State 3: Keys generated */}
      {keys && (
        <>
          <p className="mt-4 text-text-muted leading-relaxed">
            Your Peroxo credentials have been generated successfully.
          </p>

          <div className="mt-6 bg-white border border-border rounded-xl p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Project ID
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-sm bg-bg-code text-text-code rounded-lg px-4 py-3 overflow-x-auto">
                  {keys.project_id}
                </div>
                <CopyButton value={keys.project_id} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-sm bg-bg-code text-text-code rounded-lg px-4 py-3 overflow-x-auto">
                  {keys.secret_api_key}
                </div>
                <CopyButton value={keys.secret_api_key} />
              </div>
            </div>
          </div>

          <Callout variant="warning" title="Store these securely">
            The <code className="font-mono text-sm">secret_api_key</code> will
            not be shown again. Do not expose it in frontend code or commit it
            to version control.
          </Callout>

          <button
            onClick={handleGenerateAnother}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-rust hover:text-accent-orange transition-colors"
          >
            <KeyRound size={16} />
            Generate Another
          </button>
        </>
      )}
    </>
  );
}
