import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import StepFlow from "@/components/StepFlow";
import InlineCode from "@/components/InlineCode";

export const metadata: Metadata = {
  title: "Reconnection & Sync — Peroxo Docs",
  description:
    "How to reconnect to Peroxo and sync missed messages after a disconnect.",
};

export default function ReconnectionPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">Reconnection &amp; Sync</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        When a client disconnects and reconnects, it may have missed messages.
        Peroxo provides a sync mechanism to catch up.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Request: SyncMessages
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Client → Server
      </p>
      <CodeBlock
        language="json"
        code={`{
  "SyncMessages": {
    "project_id": "peroxo_pj_a1b2c3d4e5",
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
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
                <InlineCode>project_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">string</td>
              <td className="px-4 py-2 text-text-muted">Your tenant&apos;s project ID</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-2">
                <InlineCode>conversation_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">string</td>
              <td className="px-4 py-2 text-text-muted">Which conversation to sync</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-2">
                <InlineCode>message_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">UUID</td>
              <td className="px-4 py-2 text-text-muted">
                The server_message_id of the last message the client has locally
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-text mt-10">
        Response: SyncMessagesResponse
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Server → Client
      </p>
      <CodeBlock
        language="json"
        code={`{
  "SyncMessagesResponse": {
    "messages": [
      {
        "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "message_id": "g58bd31c-69cc-5483-c678-2e13b3d4e5f6",
        "sender_id": "user_456",
        "recipient_id": "user_123",
        "message_text": "you missed this",
        "created_at": 1719755000000
      }
    ]
  }
}`}
      />
      <p className="mt-3 text-sm text-text-muted">
        Returns all messages in the conversation that are{" "}
        <strong>newer</strong> than the provided message_id.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Reconnection Pattern
      </h2>
      <StepFlow
        steps={[
          {
            title: "Detect disconnect",
            description: "WebSocket onclose fires.",
          },
          {
            title: "Re-mint token",
            description:
              "If the current one is near expiry or expired, call your backend.",
          },
          {
            title: "Reconnect WebSocket",
            description: (
              <>
                <InlineCode>
                  wss://peroxo.mutref.tech/ws?token=&lt;new_token&gt;
                </InlineCode>
              </>
            ),
          },
          {
            title: "Sync each active conversation",
            description: (
              <>
                Send <InlineCode>SyncMessages</InlineCode> with the last known{" "}
                <InlineCode>message_id</InlineCode> for each conversation.
              </>
            ),
          },
          {
            title: "Merge results",
            description: (
              <>
                Insert <InlineCode>SyncMessagesResponse</InlineCode> messages into
                local state, deduplicating by{" "}
                <InlineCode>message_id</InlineCode>.
              </>
            ),
          },
          {
            title: "Resume normal operation",
            description: (
              <>
                New real-time messages arrive via{" "}
                <InlineCode>DirectMessage</InlineCode> as usual.
              </>
            ),
          },
        ]}
      />

      <Callout variant="info">
        Always persist the latest server_message_id (or message_id from history)
        locally, so you have a reliable sync cursor after a disconnect.
      </Callout>
    </>
  );
}
