import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import EndpointCard from "@/components/EndpointCard";
import StepFlow from "@/components/StepFlow";
import InlineCode from "@/components/InlineCode";

export const metadata: Metadata = {
  title: "Authentication — Peroxo Docs",
  description:
    "Learn how to mint and verify user tokens for Peroxo WebSocket authentication.",
};

export default function AuthenticationPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">Authentication</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        Peroxo uses short-lived opaque tokens to authenticate WebSocket
        connections. Your backend mints a token for each user; the client passes
        it when connecting.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">Token Flow</h2>
      <StepFlow
        steps={[
          {
            title: "Your backend calls Peroxo's Auth Service",
            description: (
              <>
                Passes <InlineCode>user_id</InlineCode>,{" "}
                <InlineCode>project_id</InlineCode>, and{" "}
                <InlineCode>secret_api_key</InlineCode>.
              </>
            ),
          },
          {
            title: "Auth Service returns a token",
            description: (
              <>
                Format:{" "}
                <InlineCode>pxtok_&lt;24 alphanumeric chars&gt;</InlineCode>,
                stored in Redis with a 600-second TTL.
              </>
            ),
          },
          {
            title: "Client uses the token to connect WebSocket",
            description: "Passed as a query parameter in the WebSocket URL.",
          },
          {
            title: "Token expires after 10 minutes",
            description: (
              <>
                No refresh endpoint — call{" "}
                <InlineCode>/generate-user-token</InlineCode> again to mint a
                new one.
              </>
            ),
          },
        ]}
      />

      <h2 className="text-2xl font-bold text-text mt-10">Mint a User Token</h2>
      <EndpointCard
        method="POST"
        path="https://auth.mutref.tech/generate-user-token"
        description="Create a short-lived session token for a user."
      >
        <div className="pt-4">
          <h4 className="font-semibold text-sm text-text mb-2">
            Request body
          </h4>
          <CodeBlock
            language="json"
            code={`{
  "user_id": "user_123",
  "project_id": "peroxo_pj_a1b2c3d4e5",
  "secret_api_key": "peroxo_AbCdEfGhIjKlMnOpQrStUvWxYz0123456789ABCD"
}`}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-accent text-left">
                  <th className="px-4 py-2 font-semibold text-text">Field</th>
                  <th className="px-4 py-2 font-semibold text-text">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2">
                    <InlineCode>user_id</InlineCode>
                  </td>
                  <td className="px-4 py-2 text-text-muted">
                    Your application&apos;s identifier for this user (arbitrary
                    string)
                  </td>
                </tr>
                <tr className="border-b border-border bg-bg">
                  <td className="px-4 py-2">
                    <InlineCode>project_id</InlineCode>
                  </td>
                  <td className="px-4 py-2 text-text-muted">
                    Your tenant&apos;s project ID
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2">
                    <InlineCode>secret_api_key</InlineCode>
                  </td>
                  <td className="px-4 py-2 text-text-muted">
                    Your tenant&apos;s secret key
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold text-sm text-text mt-6 mb-2">
            Response (200 OK)
          </h4>
          <CodeBlock
            language="json"
            code={`{
  "user_token": "pxtok_aBcDeFgHiJkLmNoPqRsTuVwX"
}`}
          />

          <h4 className="font-semibold text-sm text-text mt-6 mb-2">Errors</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-accent text-left">
                  <th className="px-4 py-2 font-semibold text-text">Status</th>
                  <th className="px-4 py-2 font-semibold text-text">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-text">401</td>
                  <td className="px-4 py-2 text-text-muted">
                    Invalid project_id or secret_api_key mismatch (plain text
                    body)
                  </td>
                </tr>
                <tr className="border-b border-border bg-bg">
                  <td className="px-4 py-2 text-text">500</td>
                  <td className="px-4 py-2 text-text-muted">
                    Redis or database failure (plain text body)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </EndpointCard>

      <h2 className="text-2xl font-bold text-text mt-10">
        Verify a Token (Optional)
      </h2>
      <p className="mt-3 text-text-muted leading-relaxed">
        This endpoint is useful for server-side verification or debugging. It is
        not required for normal operation.
      </p>
      <EndpointCard
        method="POST"
        path="https://auth.mutref.tech/verify-user-token"
        description="Check whether a token is valid and retrieve its metadata."
      >
        <div className="pt-4">
          <h4 className="font-semibold text-sm text-text mb-2">
            Request body — a bare JSON string, not an object
          </h4>
          <CodeBlock
            language="json"
            code={`"pxtok_aBcDeFgHiJkLmNoPqRsTuVwX"`}
          />

          <h4 className="font-semibold text-sm text-text mt-6 mb-2">
            Response (200) — valid token
          </h4>
          <CodeBlock
            language="json"
            code={`{
  "project_id": "peroxo_pj_a1b2c3d4e5",
  "user_id": "user_123",
  "expires_at": 1719750000
}`}
          />

          <h4 className="font-semibold text-sm text-text mt-6 mb-2">
            Response (200) — invalid or expired
          </h4>
          <CodeBlock language="json" code={`null`} />
        </div>
      </EndpointCard>

      <h2 className="text-2xl font-bold text-text mt-10">Token Lifecycle</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-accent text-left">
              <th className="px-4 py-3 font-semibold text-text">Property</th>
              <th className="px-4 py-3 font-semibold text-text">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">Format</td>
              <td className="px-4 py-3 text-text-muted">
                <InlineCode>pxtok_</InlineCode> + 24 alphanumeric characters
              </td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-3 text-text">TTL</td>
              <td className="px-4 py-3 text-text-muted">
                600 seconds (10 minutes)
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">Storage</td>
              <td className="px-4 py-3 text-text-muted">Redis (SETEX)</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-3 text-text">Refresh mechanism</td>
              <td className="px-4 py-3 text-text-muted">
                None — call <InlineCode>/generate-user-token</InlineCode> again
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">Validation</td>
              <td className="px-4 py-3 text-text-muted">
                Redis key lookup + expires_at check
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-text mt-10">Best Practices</h2>
      <Callout variant="info" title="Token handling best practices">
        <ul className="space-y-1.5 list-disc pl-4">
          <li>
            Call /generate-user-token from your <strong>backend server</strong>,
            never from client-side code
          </li>
          <li>
            Mint a new token <strong>before</strong> each WebSocket connection
            attempt
          </li>
          <li>
            Track minted_at locally and re-mint proactively ~60 seconds before
            the 600s expiry
          </li>
          <li>On WebSocket disconnect, re-mint before reconnecting</li>
          <li>
            Never store secret_api_key in frontend code, local storage, or
            client bundles
          </li>
        </ul>
      </Callout>
    </>
  );
}
