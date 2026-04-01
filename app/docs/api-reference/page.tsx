import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import EndpointCard from "@/components/EndpointCard";
import MessageDirection from "@/components/MessageDirection";

export const metadata: Metadata = {
  title: "API Reference — Peroxo Docs",
  description:
    "Complete reference of every HTTP endpoint and WebSocket message type in Peroxo.",
};

export default function ApiReferencePage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">API Reference</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        A complete reference of every HTTP endpoint and WebSocket message type.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">HTTP Endpoints</h2>
      <EndpointCard
        method="POST"
        path="https://auth.mutref.tech/generate-user-token"
        description="Mint a user session token."
      />
      <EndpointCard
        method="POST"
        path="https://auth.mutref.tech/verify-user-token"
        description="Verify a token (optional)."
      />
      <EndpointCard
        method="GET"
        path="https://peroxo.mutref.tech/conversations"
        description="Get or create a conversation."
      />
      <EndpointCard
        method="WS"
        path="wss://peroxo.mutref.tech/ws?token=<token>"
        description="WebSocket connection."
      />

      <h2 className="text-2xl font-bold text-text mt-10">
        WebSocket Message Types
      </h2>
      <div className="mt-4 space-y-3">
        <MessageDirection direction="client-to-server" name="SendDirectMessage" status="active" />
        <MessageDirection direction="server-to-client" name="DirectMessage" status="active" />
        <MessageDirection direction="server-to-client" name="MessageAck" status="active" />
        <MessageDirection direction="client-to-server" name="GetPaginatedMessages" status="active" />
        <MessageDirection direction="server-to-client" name="ChatHistoryResponse" status="active" />
        <MessageDirection direction="client-to-server" name="SyncMessages" status="active" />
        <MessageDirection direction="server-to-client" name="SyncMessagesResponse" status="active" />
        <MessageDirection direction="client-to-server" name="JoinRoom" status="active" />
        <MessageDirection direction="bidirectional" name="RoomMessage" status="active" />
        <MessageDirection direction="client-to-server" name="LeaveRoom" status="defined-not-handled" />
        <MessageDirection direction="server-to-client" name="Presence" status="defined-not-emitted" />
      </div>

      <h2 className="text-2xl font-bold text-text mt-10">Shared Types</h2>

      <h3 className="text-lg font-semibold text-text mt-6">TenantUserId</h3>
      <CodeBlock
        language="json"
        code={`{
  "project_id": "peroxo_pj_...",
  "user_id": "user_123"
}`}
      />

      <h3 className="text-lg font-semibold text-text mt-6">MessageStatus</h3>
      <p className="mt-2 text-text-muted text-sm">One of three shapes:</p>
      <CodeBlock language="json" code={`"Persisted"`} />
      <CodeBlock language="json" code={`"Delivered"`} />
      <CodeBlock language="json" code={`{ "Failed": "error description" }`} />

      <h3 className="text-lg font-semibold text-text mt-6">PresenceStatus</h3>
      <CodeBlock language="json" code={`"Online"`} />
      <CodeBlock language="json" code={`"Offline"`} />

      <h3 className="text-lg font-semibold text-text mt-6">
        ResponseDirectMessage
      </h3>
      <CodeBlock
        language="json"
        code={`{
  "conversation_id": "conv-uuid",
  "message_id": "msg-uuid",
  "sender_id": "user_123",
  "recipient_id": "user_456",
  "message_text": "hello",
  "created_at": 1719750000000
}`}
      />

      <h2 className="text-2xl font-bold text-text mt-10">
        Complete Message Shapes
      </h2>

      <h3 className="text-lg font-semibold text-text mt-6">
        SendDirectMessage
      </h3>
      <CodeBlock
        language="json"
        title="Client → Server"
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

      <h3 className="text-lg font-semibold text-text mt-6">DirectMessage</h3>
      <CodeBlock
        language="json"
        title="Server → Client"
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

      <h3 className="text-lg font-semibold text-text mt-6">MessageAck</h3>
      <CodeBlock
        language="json"
        title="Server → Client"
        code={`{
  "MessageAck": {
    "client_message_id": "550e8400-e29b-41d4-a716-446655440000",
    "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": 1719750000000,
    "status": "Persisted"
  }
}`}
      />

      <h3 className="text-lg font-semibold text-text mt-6">
        GetPaginatedMessages
      </h3>
      <CodeBlock
        language="json"
        title="Client → Server"
        code={`{
  "GetPaginatedMessages": {
    "project_id": "peroxo_pj_a1b2c3d4e5",
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message_id": null
  }
}`}
      />

      <h3 className="text-lg font-semibold text-text mt-6">
        ChatHistoryResponse
      </h3>
      <CodeBlock
        language="json"
        title="Server → Client"
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

      <h3 className="text-lg font-semibold text-text mt-6">SyncMessages</h3>
      <CodeBlock
        language="json"
        title="Client → Server"
        code={`{
  "SyncMessages": {
    "project_id": "peroxo_pj_a1b2c3d4e5",
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}`}
      />

      <h3 className="text-lg font-semibold text-text mt-6">
        SyncMessagesResponse
      </h3>
      <CodeBlock
        language="json"
        title="Server → Client"
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

      <h3 className="text-lg font-semibold text-text mt-6">JoinRoom</h3>
      <CodeBlock
        language="json"
        title="Client → Server"
        code={`{
  "JoinRoom": {
    "room_id": "room-general"
  }
}`}
      />

      <h3 className="text-lg font-semibold text-text mt-6">RoomMessage</h3>
      <CodeBlock
        language="json"
        title="Client ↔ Server"
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

      <h3 className="text-lg font-semibold text-text mt-6">LeaveRoom</h3>
      <CodeBlock
        language="json"
        title="Client → Server (not handled)"
        code={`{
  "LeaveRoom": {
    "room_id": "room-general"
  }
}`}
      />

      <h2 className="text-2xl font-bold text-text mt-10">Presence (Future)</h2>
      <p className="mt-3 text-text-muted leading-relaxed">
        The Presence message type is defined in the protocol but not currently
        emitted by the server. The server tracks online users internally for
        routing purposes, but does not broadcast presence changes over WebSocket.
        The type exists for future use:
      </p>
      <CodeBlock
        language="json"
        code={`{
  "Presence": {
    "user": {
      "project_id": "peroxo_pj_...",
      "user_id": "user_456"
    },
    "status": "Online"
  }
}`}
      />
    </>
  );
}
