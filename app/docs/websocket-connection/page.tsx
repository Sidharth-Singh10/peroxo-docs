import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import StepFlow from "@/components/StepFlow";
import InlineCode from "@/components/InlineCode";

export const metadata: Metadata = {
  title: "WebSocket Connection — Peroxo Docs",
  description:
    "How to establish and manage a WebSocket connection to the Peroxo gateway.",
};

export default function WebSocketConnectionPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">WebSocket Connection</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        All real-time communication with Peroxo happens over a single WebSocket
        connection per user.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">Connection URL</h2>
      <CodeBlock
        language="text"
        code="wss://peroxo.mutref.tech/ws?token=pxtok_aBcDeFgHiJkLmNoPqRsTuVwX"
      />
      <p className="mt-2 text-sm text-text-muted">
        The token is passed as a <strong>query parameter</strong>. No
        Authorization header is used.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">Connection Flow</h2>
      <StepFlow
        steps={[
          {
            title: "Mint a token",
            description: (
              <>
                Call POST{" "}
                <InlineCode>
                  https://auth.mutref.tech/generate-user-token
                </InlineCode>{" "}
                from your backend.
              </>
            ),
          },
          {
            title: "Open WebSocket",
            description: (
              <>
                Connect to{" "}
                <InlineCode>
                  wss://peroxo.mutref.tech/ws?token=pxtok_...
                </InlineCode>
              </>
            ),
          },
          {
            title: "Server verifies",
            description:
              "The gateway calls the auth service internally via gRPC.",
          },
          {
            title: "On success",
            description:
              "WebSocket is established; the user is registered as online in the message router.",
          },
          {
            title: "On failure",
            description:
              "HTTP error response is returned (no WebSocket upgrade).",
          },
        ]}
      />

      <h2 className="text-2xl font-bold text-text mt-10">Connection Errors</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-accent text-left">
              <th className="px-4 py-3 font-semibold text-text">
                Status Code
              </th>
              <th className="px-4 py-3 font-semibold text-text">Meaning</th>
              <th className="px-4 py-3 font-semibold text-text">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">400</td>
              <td className="px-4 py-3 text-text-muted">
                Missing token query parameter
              </td>
              <td className="px-4 py-3 text-text-muted">
                Include ?token= in the URL
              </td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-3 text-text">401</td>
              <td className="px-4 py-3 text-text-muted">
                Token is invalid or expired
              </td>
              <td className="px-4 py-3 text-text-muted">
                Re-mint the token and retry
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">500</td>
              <td className="px-4 py-3 text-text-muted">
                Auth service internal failure
              </td>
              <td className="px-4 py-3 text-text-muted">
                Retry with exponential backoff
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-text mt-10">
        Single Connection Constraint
      </h2>
      <Callout variant="warning">
        Only <strong>one</strong> WebSocket connection per{" "}
        <InlineCode>
          {"{project_id, user_id}"}
        </InlineCode>{" "}
        pair is allowed at any time. If a second connection attempt is made with
        the same identity, it will fail with the error &quot;User already
        online&quot;. Close the existing connection before opening a new one.
      </Callout>

      <h2 className="text-2xl font-bold text-text mt-10">
        Disconnect Behavior
      </h2>
      <p className="mt-3 text-text-muted leading-relaxed">
        When the WebSocket closes (client-initiated or server-initiated), the
        user is <strong>automatically unregistered</strong> from the message
        router. They will no longer receive messages until they reconnect.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Example (JavaScript)
      </h2>
      <CodeBlock
        language="typescript"
        code={`const token = "pxtok_aBcDeFgHiJkLmNoPqRsTuVwX"; // from your backend
const ws = new WebSocket(\`wss://peroxo.mutref.tech/ws?token=\${token}\`);

ws.onopen = () => {
  console.log("Connected to Peroxo");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle incoming messages — see Direct Messaging, Rooms, etc.
};

ws.onclose = (event) => {
  console.log("Disconnected", event.code, event.reason);
  // Re-mint token and reconnect
};

ws.onerror = (error) => {
  console.error("WebSocket error", error);
};`}
      />
    </>
  );
}
