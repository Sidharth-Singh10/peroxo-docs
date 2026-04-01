import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import InlineCode from "@/components/InlineCode";
import StepFlow from "@/components/StepFlow";

export const metadata: Metadata = {
  title: "Message History & Pagination — Peroxo Docs",
  description:
    "Load older messages using cursor-based pagination over the Peroxo WebSocket.",
};

export default function MessageHistoryPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">
        Message History &amp; Pagination
      </h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        Peroxo stores all messages in ScyllaDB. You can load older messages using
        cursor-based pagination over the WebSocket.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Request: GetPaginatedMessages
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Client → Server
      </p>
      <CodeBlock
        language="json"
        code={`{
  "GetPaginatedMessages": {
    "project_id": "peroxo_pj_a1b2c3d4e5",
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message_id": null
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
              <td className="px-4 py-2 text-text-muted">Which conversation to fetch</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-2">
                <InlineCode>message_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">UUID or null</td>
              <td className="px-4 py-2 text-text-muted">
                Pagination cursor: null for the first page (most recent), or a UUID to fetch messages older than that ID
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-text-muted">
        Returns up to <strong>50 messages</strong> per page, newest first
        (descending by message_id, which is UUID v1 / time-ordered).
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Response: ChatHistoryResponse
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Server → Client
      </p>
      <CodeBlock
        language="json"
        code={`{
  "ChatHistoryResponse": {
    "messages": [
      {
        "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "sender_id": "user_123",
        "recipient_id": "user_456",
        "message_text": "older message",
        "created_at": 1719740000000
      }
    ],
    "has_more": true,
    "next_cursor": "e37ab20a-48bb-3261-b456-1d01a1b2c3d4"
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
                <InlineCode>messages</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">Array</td>
              <td className="px-4 py-2 text-text-muted">The page of ResponseDirectMessage objects</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-2">
                <InlineCode>has_more</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">boolean</td>
              <td className="px-4 py-2 text-text-muted">Whether more pages exist</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-2">
                <InlineCode>next_cursor</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">UUID or null</td>
              <td className="px-4 py-2 text-text-muted">Pass this as message_id in the next request to load older messages</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-text mt-10">
        ResponseDirectMessage Shape
      </h2>
      <CodeBlock
        language="json"
        code={`{
  "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "sender_id": "user_123",
  "recipient_id": "user_456",
  "message_text": "hello",
  "created_at": 1719750000000
}`}
      />

      <h2 className="text-2xl font-bold text-text mt-10">Pagination Pattern</h2>
      <StepFlow
        steps={[
          {
            title: "First load",
            description: (
              <>
                Send <InlineCode>GetPaginatedMessages</InlineCode> with{" "}
                <InlineCode>message_id: null</InlineCode> to get the most recent
                page.
              </>
            ),
          },
          {
            title: 'User scrolls up / taps "Load More"',
            description: (
              <>
                Send with <InlineCode>message_id</InlineCode> set to{" "}
                <InlineCode>next_cursor</InlineCode> from the previous response.
              </>
            ),
          },
          {
            title: "has_more is false",
            description:
              "You've reached the beginning of the conversation.",
          },
          {
            title: "Merge with real-time",
            description: (
              <>
                New <InlineCode>DirectMessage</InlineCode> events arrive
                independently; insert them into your local message list by
                timestamp.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
