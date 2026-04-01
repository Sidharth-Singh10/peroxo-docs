import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import InlineCode from "@/components/InlineCode";

export const metadata: Metadata = {
  title: "Error Handling — Peroxo Docs",
  description:
    "A reference for every error condition your client may encounter and how to handle it.",
};

export default function ErrorHandlingPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">Error Handling</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        A reference for every error condition your client may encounter and how
        to handle it.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-accent text-left">
              <th className="px-4 py-3 font-semibold text-text">Scenario</th>
              <th className="px-4 py-3 font-semibold text-text">Signal</th>
              <th className="px-4 py-3 font-semibold text-text">
                Recommended Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">Token expired</td>
              <td className="px-4 py-3 text-text-muted">
                WebSocket connect returns HTTP 401
              </td>
              <td className="px-4 py-3 text-text-muted">
                Re-mint token via your backend, reconnect
              </td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-3 text-text">Bad credentials</td>
              <td className="px-4 py-3 text-text-muted">
                POST /generate-user-token returns 401
              </td>
              <td className="px-4 py-3 text-text-muted">
                Check project_id and secret_api_key in your config
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">User already online</td>
              <td className="px-4 py-3 text-text-muted">
                WebSocket session creation fails (connection closes immediately)
              </td>
              <td className="px-4 py-3 text-text-muted">
                Close any stale connection first, or wait briefly and retry
              </td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-3 text-text">
                Message persistence failed
              </td>
              <td className="px-4 py-3 text-text-muted">
                MessageAck with{" "}
                <InlineCode>
                  {"{ \"Failed\": \"reason\" }"}
                </InlineCode>{" "}
                status
              </td>
              <td className="px-4 py-3 text-text-muted">
                Show retry option to the user; the message may have been
                delivered in real time
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">WebSocket disconnected</td>
              <td className="px-4 py-3 text-text-muted">
                onclose event fires
              </td>
              <td className="px-4 py-3 text-text-muted">
                Re-mint token if needed, reconnect, sync missed messages per
                conversation
              </td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-3 text-text">
                Malformed JSON sent by client
              </td>
              <td className="px-4 py-3 text-text-muted">
                Server logs the error and ignores the frame
              </td>
              <td className="px-4 py-3 text-text-muted">
                No client-visible signal — fix serialization in your client code
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">Unknown message variant</td>
              <td className="px-4 py-3 text-text-muted">
                Server ignores it
              </td>
              <td className="px-4 py-3 text-text-muted">
                No action needed; future server versions may add new message
                types
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-text mt-10">
        Reconnection Strategy
      </h2>
      <Callout variant="info" title="Exponential backoff">
        <p>
          Implement exponential backoff for reconnection attempts to avoid
          overwhelming the server:
        </p>
      </Callout>
      <CodeBlock
        language="typescript"
        code={`let attempt = 0;
const MAX_DELAY = 30000; // 30 seconds

function reconnect() {
  const delay = Math.min(1000 * Math.pow(2, attempt), MAX_DELAY);
  attempt++;
  setTimeout(async () => {
    try {
      const token = await mintNewToken(); // call your backend
      const ws = new WebSocket(\`wss://peroxo.mutref.tech/ws?token=\${token}\`);
      ws.onopen = () => { attempt = 0; syncAllConversations(ws); };
      ws.onclose = () => reconnect();
    } catch {
      reconnect();
    }
  }, delay);
}`}
      />
    </>
  );
}
