# Peroxo Documentation Site — AI Agent Prompt

You are building a documentation website for **Peroxo**, a high-performance real-time messaging backend written in Rust. The site has two parts: a marketing-style landing page and a layered documentation section that walks a developer through full integration from authentication to real-time chat.

---

## 1. Project Setup

Create a Next.js project with the App Router:

```bash
npx create-next-app@latest peroxo-docs --typescript --tailwind --app --src-dir --no-eslint
cd peroxo-docs
npm install prism-react-renderer lucide-react
```

### Technology stack

| Tool | Purpose |
|------|---------|
| Next.js  (App Router) | Framework, static export |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| prism-react-renderer | Syntax-highlighted code blocks |
| lucide-react | Icons |

### Build target

The site must be fully static. Configure `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};
module.exports = nextConfig;
```

### Fonts

Use `next/font/google` to load:
- **Inter** (weights 400, 500, 600, 700) — body text
- **JetBrains Mono** (weight 400) — code blocks and inline code

Apply Inter to `<body>` via a CSS variable `--font-sans`. Apply JetBrains Mono via `--font-mono`.

---

## 2. Design System

### 2.1 Color Palette

The theme is **light mode only**. The accent palette evokes Rust (the material, not just the language) — warm reds and burnt oranges.

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#FAFAFA` | Page background |
| `--bg-card` | `#FFFFFF` | Card / panel backgrounds |
| `--bg-code` | `#1E1E2E` | Code block backgrounds (dark) |
| `--text` | `#1A1A1A` | Primary body text |
| `--text-muted` | `#6B7280` | Secondary / caption text |
| `--text-code` | `#E2E8F0` | Text inside dark code blocks |
| `--accent-rust` | `#B7410E` | Primary accent — links, active sidebar, logo |
| `--accent-orange` | `#E85D04` | Hover states, gradient midpoint |
| `--accent-warm` | `#F48C06` | Gradient endpoint, badges, highlights |
| `--border` | `#E5E7EB` | Card borders, dividers |
| `--border-accent` | `#B7410E33` | Subtle accent-tinted borders (20% opacity) |
| `--surface-accent` | `#B7410E0A` | Very faint accent wash for feature cards |

### 2.2 Gradients

Use a left-to-right or top-left-to-bottom-right gradient for hero backgrounds, CTA buttons, and decorative stripes:

```css
--gradient-rust: linear-gradient(135deg, #B7410E 0%, #E85D04 50%, #F48C06 100%);
```

### 2.3 Typography Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Hero heading | 3.5rem (56px) | 700 | Inter |
| Section heading (h2) | 2rem (32px) | 700 | Inter |
| Subsection heading (h3) | 1.5rem (24px) | 600 | Inter |
| Body / paragraph | 1rem (16px) | 400 | Inter |
| Inline code | 0.875rem (14px) | 400 | JetBrains Mono |
| Code block | 0.875rem (14px) | 400 | JetBrains Mono |
| Caption / small | 0.75rem (12px) | 500 | Inter |

### 2.4 Component Patterns

- **Cards**: `bg-white border border-[--border] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`
- **Buttons (primary)**: Background uses `--gradient-rust`, white text, rounded-lg, px-6 py-3, hover: slight scale + shadow
- **Buttons (secondary)**: Transparent bg, border `--accent-rust`, text `--accent-rust`, hover: faint accent bg
- **Inline code**: `bg-[#B7410E0F] text-[#B7410E] px-1.5 py-0.5 rounded font-mono text-sm`
- **Code blocks**: Dark bg `#1E1E2E`, rounded-xl, with a header bar showing the language label and a copy-to-clipboard button
- **Tables**: Striped rows with `bg-[#FAFAFA]` alternating, header row has faint accent bg
- **Callouts**: Left-bordered boxes in three variants:
  - `info` — blue-left-border (`#3B82F6`), light blue bg
  - `warning` — orange-left-border (`#F48C06`), light orange bg
  - `danger` — red-left-border (`#EF4444`), light red bg

### 2.5 Layout

- **Max content width**: `max-w-7xl` (landing page), `max-w-4xl` (docs prose)
- **Docs layout**: Sticky left sidebar (240px) + main content area + optional right-side table-of-contents (200px, hidden on mobile)
- **Sidebar**: Sticky, starts below the top nav, full viewport height minus nav, scrollable, grouped sections with bold group titles
- **Active sidebar item**: Left accent border `--accent-rust`, bold text, faint accent background
- **Top nav**: Fixed, white bg, bottom border, contains logo wordmark (left) and GitHub + "Get Started" links (right)
- **Mobile**: Sidebar collapses into a hamburger-triggered drawer; docs content goes full-width

---

## 3. Reusable Components

Build these components in `src/components/`:

### 3.1 `CodeBlock`

Props: `code: string`, `language: string`, `title?: string`

- Renders syntax-highlighted code using `prism-react-renderer` with a dark theme (e.g., `themes.vsDark` or `themes.dracula`)
- Header bar with language/title label on the left, copy button on the right
- Copy button: clipboard icon, on click copies `code` to clipboard, shows checkmark for 2 seconds
- Rounded corners, dark background `#1E1E2E`

### 3.2 `Callout`

Props: `variant: "info" | "warning" | "danger"`, `title?: string`, `children: ReactNode`

- Left-bordered box with icon (Info circle, Alert triangle, X circle from lucide)
- Background tint matching the variant
- Title in bold if provided, children as body text

### 3.3 `EndpointCard`

Props: `method: "GET" | "POST"`, `path: string`, `description: string`, `children?: ReactNode`

- Displays a method badge (GET = green, POST = blue) next to the full URL path
- Description below
- Expandable children area for request/response details

### 3.4 `MessageDirection`

Props: `direction: "client-to-server" | "server-to-client" | "bidirectional"`, `name: string`, `status: "active" | "defined-not-handled" | "defined-not-emitted"`

- A small visual pill showing an arrow (right arrow, left arrow, or double arrow) with the message variant name
- Status badge: green "Active", yellow "Not Handled", gray "Not Emitted"

### 3.5 `Sidebar`

- Reads the docs navigation structure from a constant array
- Renders grouped links; highlights the current route
- Scroll-spy: if multiple sections on a page, highlights the currently visible section
- Collapsible on mobile via a hamburger toggle

### 3.6 `StepFlow`

Props: `steps: Array<{ title: string; description: string; code?: string }>`

- Vertical numbered steps with a connecting line
- Each step has a numbered circle (using accent gradient), title, description, and optional code block
- The line uses a faint accent color

---

## 4. Site Structure

```
src/app/
├── layout.tsx            # Root layout: fonts, nav, metadata
├── page.tsx              # Landing page
└── docs/
    ├── layout.tsx        # Docs layout: sidebar + content area
    ├── overview/
    │   └── page.tsx
    ├── authentication/
    │   └── page.tsx
    ├── websocket-connection/
    │   └── page.tsx
    ├── conversations/
    │   └── page.tsx
    ├── direct-messaging/
    │   └── page.tsx
    ├── message-history/
    │   └── page.tsx
    ├── reconnection/
    │   └── page.tsx
    ├── rooms/
    │   └── page.tsx
    ├── api-reference/
    │   └── page.tsx
    └── error-handling/
        └── page.tsx
```

### Navigation order (sidebar)

This order is intentional — a developer reading top to bottom can integrate Peroxo from scratch:

1. **Getting Started**
   - Overview
   - Authentication
   - WebSocket Connection
2. **Messaging**
   - Conversations
   - Direct Messaging
   - Message History
   - Reconnection & Sync
   - Room Messaging
3. **Reference**
   - API Reference
   - Error Handling

---

## 5. Landing Page (`/`)

### Hero Section

- Full-width section with a faint radial gradient using the rust accent palette behind the content
- Large heading: **"Real-time messaging infrastructure, forged in Rust."**
- Subheading: "Peroxo is a high-performance WebSocket messaging backend with actor-based routing, sub-millisecond delivery, and zero lock contention. Integrate real-time chat into your app in minutes."
- Two CTA buttons side by side:
  - "Get Started" (primary, gradient bg) → links to `/docs/overview`
  - "View on GitHub" (secondary, outlined) → links to `https://github.com/Sidharth-Singh10/PerOXO`
- Below the CTAs, a small terminal-style code snippet showing a quick WebSocket connect:

```json
{ "SendDirectMessage": { "conversation_id": "conv-abc", "to": { "project_id": "peroxo_pj_x7k", "user_id": "alice" }, "content": "Hello!", "client_message_id": "550e8400-..." } }
```

### Features Grid

6 cards in a 3×2 grid (2×3 on mobile). Each card has an icon (from lucide), a title, and a short description:

1. **Sub-Millisecond Routing** (icon: Zap)
   "Actor-based message router with zero mutex locks. Every message is delivered through sequential channel processing — no lock contention at any scale."

2. **Multi-Tenant Isolation** (icon: Shield)
   "Every user is scoped to a project_id. Tenant data is fully isolated at the protocol level, not just the database level."

3. **Direct Messaging** (icon: MessageSquare)
   "Send and receive direct messages with delivery acknowledgments. Track message state from 'sending' to 'persisted' with client_message_id correlation."

4. **Room Messaging** (icon: Users)
   "Create rooms, broadcast messages to all members, and let the server handle fan-out. Room membership is automatically cleaned up on disconnect."

5. **History & Sync** (icon: History)
   "Cursor-based pagination for loading older messages. On reconnect, sync missed messages with a single request per conversation."

6. **Built-in Observability** (icon: BarChart3)
   "Prometheus metrics endpoint out of the box. Pre-built Grafana dashboard for WebSocket connections, message throughput, and latency."

### Architecture Section

A simplified diagram (build as a React component using divs/SVG, not an image) showing:

```
┌─────────┐     WebSocket      ┌──────────────────┐     gRPC     ┌──────────────┐
│  Client  │ ◄──────────────► │  Peroxo Gateway   │ ◄──────────► │ Chat Service │
│   App    │                   │  (Axum + Actors)  │              │  (ScyllaDB)  │
└─────────┘                    └──────────────────┘              └──────────────┘
                                       │
                                       │ gRPC
                                       ▼
                               ┌──────────────┐
                               │ Auth Service  │
                               │ (Redis+PG)    │
                               └──────────────┘
```

Style this as boxes with connecting lines/arrows, using the accent colors for the Peroxo Gateway box.

### How It Works

A `StepFlow` with three steps:

1. **Authenticate** — "Mint a short-lived token using your project credentials. Tokens last 10 minutes and are stored in Redis."
2. **Connect** — "Open a WebSocket to Peroxo with your token. The server verifies it and registers your session."
3. **Chat** — "Send and receive JSON messages in real time. Direct messages, rooms, history, and sync — all over a single WebSocket."

### Footer

- "Peroxo" wordmark (left)
- Links: GitHub, Documentation, API Reference (center)
- "Built with Rust, Tokio, and Axum" (right)
- Faint top border, muted text

---

## 6. Documentation Pages

**IMPORTANT**: All URLs in the documentation must use these production endpoints:

| Service | URL |
|---------|-----|
| Auth Service | `https://auth.mutref.tech` |
| WebSocket Gateway | `wss://peroxo.mutref.tech` |

Do NOT reference `localhost`, port numbers, or docker container ports. The client never touches gRPC, Redis, ScyllaDB, or any internal service.

---

### 6.1 Overview (`/docs/overview`)

**Title**: "Overview"

**Content**:

Peroxo is a real-time messaging backend designed to be embedded into your application. It handles WebSocket connections, message routing, persistence, and delivery — you provide the users and the UI.

#### What Peroxo Is

- A WebSocket gateway that routes messages between users in real time
- An actor-based server written in Rust, using Tokio for async I/O
- A multi-tenant system where each tenant gets a `project_id` that isolates their users and data
- A persistence layer backed by ScyllaDB for message history and sync

#### What Peroxo Is Not

- Not a user authentication system — you bring your own login/signup flow
- Not a UI library — you build the frontend; Peroxo is the backend
- Not a push notification service — it handles real-time WebSocket delivery only

#### Service Topology

Your client app talks to exactly two services:

| Service | URL | Transport | Purpose |
|---------|-----|-----------|---------|
| Auth Service | `https://auth.mutref.tech` | HTTPS | Mint and verify user session tokens |
| Peroxo Gateway | `wss://peroxo.mutref.tech` | WSS (WebSocket) | Real-time messaging, conversations, history |

The gateway also exposes one HTTP endpoint for conversation management at the same origin.

#### What You Need

To integrate Peroxo, you need two credentials obtained during tenant provisioning:

- **`project_id`** — format: `peroxo_pj_<nanoid>` — identifies your project/tenant
- **`secret_api_key`** — format: `peroxo_<40 alphanumeric chars>` — used to mint user tokens

> **Callout (warning)**: Never expose `secret_api_key` to end users or frontend code. Token minting should happen from your backend server.

---

### 6.2 Authentication (`/docs/authentication`)

**Title**: "Authentication"

**Content**:

Peroxo uses short-lived opaque tokens to authenticate WebSocket connections. Your backend mints a token for each user; the client passes it when connecting.

#### Token Flow

Render a `StepFlow`:

1. **Your backend calls Peroxo's Auth Service** — passes `user_id`, `project_id`, and `secret_api_key`
2. **Auth Service returns a token** — format `pxtok_<24 alphanumeric chars>`, stored in Redis with a 600-second TTL
3. **Client uses the token to connect WebSocket** — passed as a query parameter
4. **Token expires after 10 minutes** — no refresh endpoint; mint a new one

#### Mint a User Token

Render as an `EndpointCard`:

```
POST https://auth.mutref.tech/generate-user-token
Content-Type: application/json
```

**Request body:**

```json
{
  "user_id": "user_123",
  "project_id": "peroxo_pj_a1b2c3d4e5",
  "secret_api_key": "peroxo_AbCdEfGhIjKlMnOpQrStUvWxYz0123456789ABCD"
}
```

- `user_id` — your application's identifier for this user (arbitrary string)
- `project_id` — your tenant's project ID
- `secret_api_key` — your tenant's secret key

**Response (200 OK):**

```json
{
  "user_token": "pxtok_aBcDeFgHiJkLmNoPqRsTuVwX"
}
```

**Errors:**

| Status | Meaning |
|--------|---------|
| 401 | Invalid `project_id` or `secret_api_key` mismatch (plain text body) |
| 500 | Redis or database failure (plain text body) |

#### Verify a Token (Optional)

This endpoint is useful for server-side verification or debugging. It is not required for normal operation.

```
POST https://auth.mutref.tech/verify-user-token
Content-Type: application/json
```

**Request body** — a bare JSON string, not an object:

```json
"pxtok_aBcDeFgHiJkLmNoPqRsTuVwX"
```

**Response (200) — valid token:**

```json
{
  "project_id": "peroxo_pj_a1b2c3d4e5",
  "user_id": "user_123",
  "expires_at": 1719750000
}
```

**Response (200) — invalid or expired:**

```json
null
```

#### Token Lifecycle

Render this as a styled table:

| Property | Value |
|----------|-------|
| Format | `pxtok_` + 24 alphanumeric characters |
| TTL | 600 seconds (10 minutes) |
| Storage | Redis (SETEX) |
| Refresh mechanism | None — call `/generate-user-token` again |
| Validation | Redis key lookup + `expires_at` check |

#### Best Practices

Render as a `Callout (info)`:

- Call `/generate-user-token` from your **backend server**, never from client-side code
- Mint a new token **before** each WebSocket connection attempt
- Track `minted_at` locally and re-mint proactively ~60 seconds before the 600s expiry
- On WebSocket disconnect, re-mint before reconnecting
- Never store `secret_api_key` in frontend code, local storage, or client bundles

---

### 6.3 WebSocket Connection (`/docs/websocket-connection`)

**Title**: "WebSocket Connection"

**Content**:

All real-time communication with Peroxo happens over a single WebSocket connection per user.

#### Connection URL

```
wss://peroxo.mutref.tech/ws?token=pxtok_aBcDeFgHiJkLmNoPqRsTuVwX
```

The token is passed as a **query parameter**. No `Authorization` header is used.

#### Connection Flow

Render as a `StepFlow`:

1. **Mint a token** — call `POST https://auth.mutref.tech/generate-user-token` from your backend
2. **Open WebSocket** — connect to `wss://peroxo.mutref.tech/ws?token=pxtok_...`
3. **Server verifies** — the gateway calls the auth service internally via gRPC
4. **On success** — WebSocket is established; the user is registered as online in the message router
5. **On failure** — HTTP error response is returned (no WebSocket upgrade)

#### Connection Errors

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 400 | Missing `token` query parameter | Include `?token=` in the URL |
| 401 | Token is invalid or expired | Re-mint the token and retry |
| 500 | Auth service internal failure | Retry with exponential backoff |

#### Single Connection Constraint

> **Callout (warning)**: Only **one** WebSocket connection per `{project_id, user_id}` pair is allowed at any time. If a second connection attempt is made with the same identity, it will fail with the error "User already online". Close the existing connection before opening a new one.

#### Disconnect Behavior

When the WebSocket closes (client-initiated or server-initiated), the user is **automatically unregistered** from the message router. They will no longer receive messages until they reconnect.

#### Example (JavaScript)

```typescript
const token = "pxtok_aBcDeFgHiJkLmNoPqRsTuVwX"; // from your backend
const ws = new WebSocket(`wss://peroxo.mutref.tech/ws?token=${token}`);

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
};
```

---

### 6.4 Conversations (`/docs/conversations`)

**Title**: "Conversations"

**Content**:

Before sending direct messages, you need a `conversation_id` for the user pair. This endpoint creates a conversation if one doesn't exist, or returns the existing one.

#### Get or Create a Conversation

Render as an `EndpointCard`:

```
GET https://peroxo.mutref.tech/conversations?project_id=<string>&user_id_1=<string>&user_id_2=<string>
```

All three query parameters are required. The server **lexicographically sorts** the two user IDs, so the order you pass them in doesn't matter — `user_id_1=alice&user_id_2=bob` and `user_id_1=bob&user_id_2=alice` return the same conversation.

**Response (200 OK):**

```json
{
  "success": true,
  "error_message": "",
  "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_new": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the operation succeeded |
| `error_message` | string | Empty on success; error detail on failure |
| `conversation_id` | string | The stable UUID for this user pair's conversation |
| `created_new` | boolean | `true` if a new conversation was just created |

**Errors:**

| Status | Meaning |
|--------|---------|
| 500 | Backend gRPC failure — response body is JSON with `success: false` and `error_message` |

> **Callout (info)**: Cache the `conversation_id` locally for each user pair. It never changes once created.

> **Callout (warning)**: This endpoint currently has **no authentication**. In production, consider proxying it through your own backend to add auth.

---

### 6.5 Direct Messaging (`/docs/direct-messaging`)

**Title**: "Direct Messaging"

**Content**:

Direct messages are the core of Peroxo. All messages are sent and received as **JSON text frames** over the WebSocket.

#### Wire Format

Peroxo uses Rust's serde library with **externally-tagged enum encoding**. Every WebSocket message is a JSON object with exactly **one key** — the message variant name — whose value is the payload:

```json
{
  "VariantName": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

This format applies to ALL messages in both directions.

#### Shared Type: `TenantUserId`

This object appears in many messages. It identifies a user within a project:

```json
{
  "project_id": "peroxo_pj_a1b2c3d4e5",
  "user_id": "user_123"
}
```

#### Sending a Message: `SendDirectMessage` (Client → Server)

```json
{
  "SendDirectMessage": {
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "to": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_456"
    },
    "content": "Hello!",
    "client_message_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `conversation_id` | string | From `GET /conversations` |
| `to` | TenantUserId | The recipient |
| `content` | string | Message text |
| `client_message_id` | UUID (v4) | Client-generated; used to correlate the acknowledgment |

**What happens server-side:**

1. Server generates a `server_message_id` (UUID v1, time-ordered)
2. Looks up the recipient in the message router
3. If the recipient is online, delivers a `DirectMessage` to them immediately
4. Persists the message to ScyllaDB via the chat service
5. Sends a `MessageAck` back to the sender

#### Receiving a Message: `DirectMessage` (Server → Client)

Received when another user sends you a direct message:

```json
{
  "DirectMessage": {
    "from": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_456"
    },
    "content": "Hello!",
    "server_message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": 1719750000000
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `from` | TenantUserId | Who sent the message |
| `content` | string | Message text |
| `server_message_id` | UUID | Server-assigned, time-ordered — use for ordering and as pagination cursor |
| `timestamp` | integer | Server timestamp in milliseconds since epoch |

> **Callout (info)**: `DirectMessage` does **not** include `conversation_id`. The client must determine the conversation from `from.user_id` using its local conversation cache.

#### Acknowledgment: `MessageAck` (Server → Client)

Sent to the original sender after their `SendDirectMessage` is processed:

```json
{
  "MessageAck": {
    "client_message_id": "550e8400-e29b-41d4-a716-446655440000",
    "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": 1719750000000,
    "status": "Persisted"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `client_message_id` | UUID | Matches the UUID the client sent in `SendDirectMessage` |
| `message_id` | UUID | The server-assigned ID (same one the recipient sees in `DirectMessage`) |
| `timestamp` | integer | Server timestamp in milliseconds |
| `status` | MessageStatus | See below |

#### `MessageStatus` Values

```json
"Persisted"
```
Message was saved to the database successfully.

```json
"Delivered"
```
Message was delivered to the recipient in real time.

```json
{ "Failed": "error description" }
```
Persistence failed. The message may still have been delivered in real time, but is not guaranteed to appear in history.

> **Callout (info)**: `Failed` is an object with a string value, not a plain string. Parse it accordingly.

#### Recommended UI Pattern

Render as a `StepFlow`:

1. **User taps send** — generate a UUID v4 as `client_message_id`, send `SendDirectMessage`, show message in "sending..." state
2. **`MessageAck` arrives** with matching `client_message_id`:
   - Status `"Persisted"` → mark as sent, replace the local ID with `message_id`, update timestamp
   - Status `{"Failed": "..."}` → show error indicator with retry option
3. **No ack within ~5 seconds** — show a warning; the message may have been delivered but persistence is unconfirmed

---

### 6.6 Message History (`/docs/message-history`)

**Title**: "Message History & Pagination"

**Content**:

Peroxo stores all messages in ScyllaDB. You can load older messages using cursor-based pagination over the WebSocket.

#### Request: `GetPaginatedMessages` (Client → Server)

```json
{
  "GetPaginatedMessages": {
    "project_id": "peroxo_pj_a1b2c3d4e5",
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message_id": null
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `project_id` | string | Your tenant's project ID |
| `conversation_id` | string | Which conversation to fetch |
| `message_id` | UUID or null | Pagination cursor: `null` for the first page (most recent), or a UUID to fetch messages older than that ID |

**Server behavior**: Returns up to **50 messages** per page, newest first (descending by `message_id`, which is UUID v1 / time-ordered).

#### Response: `ChatHistoryResponse` (Server → Client)

```json
{
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
}
```

| Field | Type | Description |
|-------|------|-------------|
| `messages` | Array of `ResponseDirectMessage` | The page of messages |
| `has_more` | boolean | Whether more pages exist |
| `next_cursor` | UUID or null | Pass this as `message_id` in the next request to load older messages |

#### `ResponseDirectMessage` Shape

```json
{
  "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "sender_id": "user_123",
  "recipient_id": "user_456",
  "message_text": "hello",
  "created_at": 1719750000000
}
```

#### Pagination Pattern

Render as a `StepFlow`:

1. **First load** — send `GetPaginatedMessages` with `message_id: null` to get the most recent page
2. **User scrolls up / taps "Load More"** — send with `message_id` set to `next_cursor` from the previous response
3. **`has_more` is `false`** — you've reached the beginning of the conversation
4. **Merge with real-time** — new `DirectMessage` events arrive independently; insert them into your local message list by timestamp

---

### 6.7 Reconnection & Sync (`/docs/reconnection`)

**Title**: "Reconnection & Sync"

**Content**:

When a client disconnects and reconnects, it may have missed messages. Peroxo provides a sync mechanism to catch up.

#### Request: `SyncMessages` (Client → Server)

```json
{
  "SyncMessages": {
    "project_id": "peroxo_pj_a1b2c3d4e5",
    "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `project_id` | string | Your tenant's project ID |
| `conversation_id` | string | Which conversation to sync |
| `message_id` | UUID | The `server_message_id` of the **last message** the client has locally |

#### Response: `SyncMessagesResponse` (Server → Client)

```json
{
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
}
```

Returns all messages in the conversation that are **newer** than the provided `message_id`.

#### Reconnection Pattern

Render as a `StepFlow`:

1. **Detect disconnect** — WebSocket `onclose` fires
2. **Re-mint token** if the current one is near expiry or expired (call your backend)
3. **Reconnect WebSocket** — `wss://peroxo.mutref.tech/ws?token=<new_token>`
4. **For each active conversation**, send `SyncMessages` with the last known `message_id`
5. **Merge results** — insert `SyncMessagesResponse` messages into local state, **deduplicating by `message_id`**
6. **Resume normal operation** — new real-time messages arrive via `DirectMessage` as usual

> **Callout (info)**: Always persist the latest `server_message_id` (or `message_id` from history) locally, so you have a reliable sync cursor after a disconnect.

---

### 6.8 Room Messaging (`/docs/rooms`)

**Title**: "Room Messaging"

**Content**:

Rooms allow group messaging. A room is identified by an arbitrary string `room_id`. Users join rooms, send messages, and receive broadcasts from all other members.

#### Join a Room: `JoinRoom` (Client → Server)

```json
{
  "JoinRoom": {
    "room_id": "room-general"
  }
}
```

- `room_id` — any string identifier for the room
- This is **fire-and-forget**: no confirmation is sent back to the client
- If the user is already in the room, the join is silently ignored
- After joining, the user will receive `RoomMessage` broadcasts for this room

#### Send a Room Message: `RoomMessage` (Client → Server)

```json
{
  "RoomMessage": {
    "room_id": "room-general",
    "from": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_123"
    },
    "content": "Hello room!",
    "message_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `room_id` | string | The room to send to |
| `from` | TenantUserId | **Must match** the authenticated user's identity; the server rejects mismatches |
| `content` | string | Message text |
| `message_id` | UUID | Client-generated; used for `MessageAck` correlation |

#### Receive a Room Broadcast: `RoomMessage` (Server → Client)

The same variant name is used for both directions:

```json
{
  "RoomMessage": {
    "room_id": "room-general",
    "from": {
      "project_id": "peroxo_pj_a1b2c3d4e5",
      "user_id": "user_456"
    },
    "content": "Hello room!",
    "message_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

> **Callout (warning)**: The `message_id` in the broadcast is a **new server-generated UUID**, not the client's original. The broadcast is sent to **all** room members, **including the sender**. The sender also receives a `MessageAck` tied to their original `message_id` (as `client_message_id`).

#### Leave a Room: `LeaveRoom`

```json
{
  "LeaveRoom": {
    "room_id": "room-general"
  }
}
```

> **Callout (warning)**: `LeaveRoom` is defined in the protocol but **not currently handled** by the server. Sending it will be silently ignored. Room membership is cleaned up automatically when the WebSocket disconnects, or when the room actor detects the member's channel is closed (periodic cleanup every ~60 seconds).

---

### 6.9 API Reference (`/docs/api-reference`)

**Title**: "API Reference"

**Content**:

This page is a complete reference of every HTTP endpoint and WebSocket message type.

#### HTTP Endpoints

Render as a table with `EndpointCard` components:

| Method | URL | Description |
|--------|-----|-------------|
| POST | `https://auth.mutref.tech/generate-user-token` | Mint a user session token |
| POST | `https://auth.mutref.tech/verify-user-token` | Verify a token (optional) |
| GET | `https://peroxo.mutref.tech/conversations` | Get or create a conversation |
| WS | `wss://peroxo.mutref.tech/ws?token=<token>` | WebSocket connection |

#### WebSocket Message Types

Render as a styled table with `MessageDirection` components:

| Message | Direction | Status |
|---------|-----------|--------|
| `SendDirectMessage` | Client → Server | Active |
| `DirectMessage` | Server → Client | Active |
| `MessageAck` | Server → Client | Active |
| `GetPaginatedMessages` | Client → Server | Active |
| `ChatHistoryResponse` | Server → Client | Active |
| `SyncMessages` | Client → Server | Active |
| `SyncMessagesResponse` | Server → Client | Active |
| `JoinRoom` | Client → Server | Active |
| `RoomMessage` | Client ↔ Server | Active |
| `LeaveRoom` | Client → Server | Defined, not handled |
| `Presence` | Server → Client | Defined, not emitted |

#### Shared Types

##### `TenantUserId`

```json
{
  "project_id": "peroxo_pj_...",
  "user_id": "user_123"
}
```

##### `MessageStatus`

One of three shapes:

```json
"Persisted"
```

```json
"Delivered"
```

```json
{ "Failed": "error description" }
```

##### `PresenceStatus`

```json
"Online"
```

```json
"Offline"
```

##### `ResponseDirectMessage`

```json
{
  "conversation_id": "conv-uuid",
  "message_id": "msg-uuid",
  "sender_id": "user_123",
  "recipient_id": "user_456",
  "message_text": "hello",
  "created_at": 1719750000000
}
```

#### Complete Message Shapes

For each message type, render a `CodeBlock` with the full JSON structure. Include every field. Use the exact JSON examples from the Direct Messaging, Message History, Reconnection, and Room Messaging documentation pages above — do not invent new examples. Add a "Copy" button to each code block.

#### Presence (Future)

The `Presence` message type is defined in the protocol but not currently emitted by the server. The server tracks online users internally for routing purposes, but does not broadcast presence changes over WebSocket. The type exists for future use:

```json
{
  "Presence": {
    "user": {
      "project_id": "peroxo_pj_...",
      "user_id": "user_456"
    },
    "status": "Online"
  }
}
```

---

### 6.10 Error Handling (`/docs/error-handling`)

**Title**: "Error Handling"

**Content**:

A reference for every error condition your client may encounter and how to handle it.

Render this as a styled table with expandable rows, or as individual cards:

| Scenario | Signal | Recommended Action |
|----------|--------|--------------------|
| Token expired | WebSocket connect returns HTTP 401 | Re-mint token via your backend, reconnect |
| Bad credentials | `POST /generate-user-token` returns 401 | Check `project_id` and `secret_api_key` in your config |
| User already online | WebSocket session creation fails (connection closes immediately) | Close any stale connection first, or wait briefly and retry |
| Message persistence failed | `MessageAck` with `{ "Failed": "reason" }` status | Show retry option to the user; the message may have been delivered in real time |
| WebSocket disconnected | `onclose` event fires | Re-mint token if needed, reconnect, sync missed messages per conversation |
| Malformed JSON sent by client | Server logs the error and ignores the frame | No client-visible signal — fix serialization in your client code |
| Unknown message variant | Server ignores it (`Ok(_)` branch) | No action needed; future server versions may add new message types |

#### Reconnection Strategy

Render as a `Callout (info)`:

Implement exponential backoff for reconnection attempts:

```typescript
let attempt = 0;
const MAX_DELAY = 30000; // 30 seconds

function reconnect() {
  const delay = Math.min(1000 * Math.pow(2, attempt), MAX_DELAY);
  attempt++;
  setTimeout(async () => {
    try {
      const token = await mintNewToken(); // call your backend
      const ws = new WebSocket(`wss://peroxo.mutref.tech/ws?token=${token}`);
      ws.onopen = () => { attempt = 0; syncAllConversations(ws); };
      ws.onclose = () => reconnect();
    } catch {
      reconnect();
    }
  }, delay);
}
```

---

## 7. Complete Integration Lifecycle

Include this as a summary section at the bottom of the Overview page, or as a dedicated callout on the landing page. It is the end-to-end flow a developer follows:

### Startup / Login

1. Your app authenticates the user through your own auth system (Peroxo does not handle login)
2. Your backend calls `POST https://auth.mutref.tech/generate-user-token` with the user's ID → receives `pxtok_...`
3. Your backend sends the token to the client
4. Client opens WebSocket: `wss://peroxo.mutref.tech/ws?token=pxtok_...`

### Opening a Chat

1. Client calls `GET https://peroxo.mutref.tech/conversations?project_id=...&user_id_1=...&user_id_2=...` → receives `conversation_id`
2. Client sends `GetPaginatedMessages` with `message_id: null` → receives `ChatHistoryResponse` with the first page
3. Client renders messages and listens for incoming `DirectMessage` events

### Sending a Message

1. Client generates a UUID v4 as `client_message_id`
2. Client sends `SendDirectMessage` over WebSocket
3. Client shows the message in "sending" state
4. On `MessageAck` with matching `client_message_id`:
   - `"Persisted"` → mark as sent, update with server `message_id` and `timestamp`
   - `{ "Failed": "..." }` → show error / retry

### Loading More History

1. Client sends `GetPaginatedMessages` with `message_id` set to `next_cursor` from the last response
2. Prepend returned messages to the chat view
3. Stop when `has_more` is `false`

### Reconnecting

1. Re-mint a token if the current one is near expiry or expired
2. Reconnect WebSocket
3. For each active conversation, send `SyncMessages` with the last known `message_id`
4. Merge `SyncMessagesResponse` messages into local state, deduplicating by `message_id`

### Using Rooms

1. Send `JoinRoom` with the room ID
2. Send `RoomMessage` to broadcast to the room
3. Receive `RoomMessage` broadcasts from other members
4. Room membership is cleared automatically on disconnect

---

## 8. Final Notes for the AI Agent

- Every code example must use the production URLs: `https://auth.mutref.tech` and `wss://peroxo.mutref.tech`. Do not use localhost or port numbers.
- The JSON examples must be **exact** — field names are case-sensitive and must match the serde serialization (e.g., `client_message_id` not `clientMessageId`).
- All pages should have a "Next" / "Previous" navigation at the bottom linking to the adjacent docs page in order.
- The landing page should feel polished and professional — not like a raw docs page.
- The docs pages should feel clean and scannable — liberal use of headings, tables, code blocks, and callouts.
- Optimize for a developer who is reading sequentially from Overview through Error Handling and wants to go from zero to a working integration.
- The site must build with `next build` and produce a static export. No server-side rendering, no API routes, no database connections.
- Use `metadata` exports on each page for proper `<title>` and `<meta description>` tags.
- GitHub repository: `https://github.com/Sidharth-Singh10/PerOXO`
