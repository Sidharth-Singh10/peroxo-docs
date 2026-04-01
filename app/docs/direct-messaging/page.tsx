import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import StepFlow from "@/components/StepFlow";
import InlineCode from "@/components/InlineCode";

export const metadata: Metadata = {
  title: "Direct Messaging — Peroxo Docs",
  description:
    "Send and receive direct messages over the Peroxo WebSocket connection.",
};

export default function DirectMessagingPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">Direct Messaging</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        Direct messages are the core of Peroxo. All messages are sent and
        received as <strong>JSON text frames</strong> over the WebSocket.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">Wire Format</h2>
      <p className="mt-3 text-text-muted leading-relaxed">
        Peroxo uses Rust&apos;s serde library with{" "}
        <strong>externally-tagged enum encoding</strong>. Every WebSocket message
        is a JSON object with exactly <strong>one key</strong> — the message
        variant name — whose value is the payload:
      </p>
      <CodeBlock
        language="json"
        code={`{
  "VariantName": {
    "field1": "value1",
    "field2": "value2"
  }
}`}
      />
      <p className="mt-2 text-sm text-text-muted">
        This format applies to ALL messages in both directions.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Shared Type: TenantUserId
      </h2>
      <p className="mt-3 text-text-muted leading-relaxed">
        This object appears in many messages. It identifies a user within a
        project:
      </p>
      <CodeBlock
        language="json"
        code={`{
  "project_id": "peroxo_pj_a1b2c3d4e5",
  "user_id": "user_123"
}`}
      />

      <h2 className="text-2xl font-bold text-text mt-10">
        Sending a Message: SendDirectMessage
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Client → Server
      </p>
      <CodeBlock
        language="json"
        code={`{
  "SendDirectMessage": {
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "to": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_456"
    },
    "content": "Hello!",
    "client_message_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}`}
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-accent text-left">
              <th className="px-4 py-2 font-semibold text-text">Field</th>
              <th className="px-4 py-2 font-semibold text-text">Type</th>
              <th className="px-4 py-2 font-semibold text-text">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-2">
                <InlineCode>conversation_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">string</td>
              <td className="px-4 py-2 text-text-muted">From GET /conversations</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-2">
                <InlineCode>to</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">TenantUserId</td>
              <td className="px-4 py-2 text-text-muted">The recipient</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-2">
                <InlineCode>content</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">string</td>
              <td className="px-4 py-2 text-text-muted">Message text</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-2">
                <InlineCode>client_message_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">UUID (v4)</td>
              <td className="px-4 py-2 text-text-muted">Client-generated; used to correlate the acknowledgment</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-text mt-8">What happens server-side</h3>
      <ol className="mt-3 space-y-2 text-text-muted list-decimal pl-5 leading-relaxed">
        <li>Server generates a server_message_id (UUID v1, time-ordered)</li>
        <li>Looks up the recipient in the message router</li>
        <li>If the recipient is online, delivers a DirectMessage to them immediately</li>
        <li>Persists the message to ScyllaDB via the chat service</li>
        <li>Sends a MessageAck back to the sender</li>
      </ol>

      <h2 className="text-2xl font-bold text-text mt-10">
        Receiving a Message: DirectMessage
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Server → Client
      </p>
      <CodeBlock
        language="json"
        code={`{
  "DirectMessage": {
    "from": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_456"
    },
    "content": "Hello!",
    "server_message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": 1719750000000
  }
}`}
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-accent text-left">
              <th className="px-4 py-2 font-semibold text-text">Field</th>
              <th className="px-4 py-2 font-semibold text-text">Type</th>
              <th className="px-4 py-2 font-semibold text-text">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-2">
                <InlineCode>from</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">TenantUserId</td>
              <td className="px-4 py-2 text-text-muted">Who sent the message</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-2">
                <InlineCode>content</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">string</td>
              <td className="px-4 py-2 text-text-muted">Message text</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-2">
                <InlineCode>server_message_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">UUID</td>
              <td className="px-4 py-2 text-text-muted">Server-assigned, time-ordered — use for ordering and as pagination cursor</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-2">
                <InlineCode>timestamp</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">integer</td>
              <td className="px-4 py-2 text-text-muted">Server timestamp in milliseconds since epoch</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout variant="info">
        DirectMessage does <strong>not</strong> include conversation_id. The
        client must determine the conversation from from.user_id using its local
        conversation cache.
      </Callout>

      <h2 className="text-2xl font-bold text-text mt-10">
        Acknowledgment: MessageAck
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Server → Client
      </p>
      <CodeBlock
        language="json"
        code={`{
  "MessageAck": {
    "client_message_id": "550e8400-e29b-41d4-a716-446655440000",
    "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": 1719750000000,
    "status": "Persisted"
  }
}`}
      />

      <h2 className="text-2xl font-bold text-text mt-10">MessageStatus Values</h2>
      <div className="mt-4 space-y-3">
        <div>
          <CodeBlock language="json" code={`"Persisted"`} />
          <p className="text-sm text-text-muted -mt-2">
            Message was saved to the database successfully.
          </p>
        </div>
        <div>
          <CodeBlock language="json" code={`"Delivered"`} />
          <p className="text-sm text-text-muted -mt-2">
            Message was delivered to the recipient in real time.
          </p>
        </div>
        <div>
          <CodeBlock language="json" code={`{ "Failed": "error description" }`} />
          <p className="text-sm text-text-muted -mt-2">
            Persistence failed. The message may still have been delivered in real
            time, but is not guaranteed to appear in history.
          </p>
        </div>
      </div>

      <Callout variant="info">
        <InlineCode>Failed</InlineCode>{" "}
        is an object with a string value, not a plain string. Parse it
        accordingly.
      </Callout>

      <h2 className="text-2xl font-bold text-text mt-10">
        Recommended UI Pattern
      </h2>
      <StepFlow
        steps={[
          {
            title: "User taps send",
            description:
              'Generate a UUID v4 as client_message_id, send SendDirectMessage, show message in "sending..." state.',
          },
          {
            title: "MessageAck arrives",
            description:
              'Status "Persisted" → mark as sent, replace the local ID with message_id, update timestamp. Status {"Failed": "..."} → show error indicator with retry option.',
          },
          {
            title: "No ack within ~5 seconds",
            description:
              "Show a warning; the message may have been delivered but persistence is unconfirmed.",
          },
        ]}
      />
    </>
  );
}
