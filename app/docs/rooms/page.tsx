import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import InlineCode from "@/components/InlineCode";

export const metadata: Metadata = {
  title: "Room Messaging — Peroxo Docs",
  description:
    "Create rooms, broadcast messages, and manage group messaging with Peroxo.",
};

export default function RoomsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">Room Messaging</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        Rooms allow group messaging. A room is identified by an arbitrary string{" "}
        <InlineCode>
          room_id
        </InlineCode>
        . Users join rooms, send messages, and receive broadcasts from all other
        members.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Join a Room: JoinRoom
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Client → Server
      </p>
      <CodeBlock
        language="json"
        code={`{
  "JoinRoom": {
    "room_id": "room-general"
  }
}`}
      />
      <ul className="mt-3 space-y-2 text-text-muted list-disc pl-5 text-sm leading-relaxed">
        <li>
          <InlineCode>room_id</InlineCode>{" "}
          — any string identifier for the room
        </li>
        <li>
          This is <strong>fire-and-forget</strong>: no confirmation is sent back
          to the client
        </li>
        <li>
          If the user is already in the room, the join is silently ignored
        </li>
        <li>
          After joining, the user will receive RoomMessage broadcasts for this
          room
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-text mt-10">
        Send a Room Message: RoomMessage
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Client → Server
      </p>
      <CodeBlock
        language="json"
        code={`{
  "RoomMessage": {
    "room_id": "room-general",
    "from": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_123"
    },
    "content": "Hello room!",
    "message_id": "550e8400-e29b-41d4-a716-446655440000"
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
                <InlineCode>room_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">string</td>
              <td className="px-4 py-2 text-text-muted">The room to send to</td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-2">
                <InlineCode>from</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">TenantUserId</td>
              <td className="px-4 py-2 text-text-muted">
                Must match the authenticated user&apos;s identity; the server
                rejects mismatches
              </td>
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
                <InlineCode>message_id</InlineCode>
              </td>
              <td className="px-4 py-2 text-text-muted">UUID</td>
              <td className="px-4 py-2 text-text-muted">
                Client-generated; used for MessageAck correlation
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-text mt-10">
        Receive a Room Broadcast: RoomMessage
      </h2>
      <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">
        Server → Client
      </p>
      <p className="mt-3 text-text-muted leading-relaxed">
        The same variant name is used for both directions:
      </p>
      <CodeBlock
        language="json"
        code={`{
  "RoomMessage": {
    "room_id": "room-general",
    "from": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_456"
    },
    "content": "Hello room!",
    "message_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}`}
      />
      <Callout variant="warning">
        The message_id in the broadcast is a <strong>new server-generated UUID</strong>,
        not the client&apos;s original. The broadcast is sent to{" "}
        <strong>all</strong> room members, <strong>including the sender</strong>.
        The sender also receives a MessageAck tied to their original message_id
        (as client_message_id).
      </Callout>

      <h2 className="text-2xl font-bold text-text mt-10">
        Leave a Room: LeaveRoom
      </h2>
      <CodeBlock
        language="json"
        code={`{
  "LeaveRoom": {
    "room_id": "room-general"
  }
}`}
      />
      <Callout variant="warning">
        LeaveRoom is defined in the protocol but <strong>not currently handled</strong>{" "}
        by the server. Sending it will be silently ignored. Room membership is
        cleaned up automatically when the WebSocket disconnects, or when the room
        actor detects the member&apos;s channel is closed (periodic cleanup every
        ~60 seconds).
      </Callout>
    </>
  );
}
