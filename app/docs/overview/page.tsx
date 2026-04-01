import type { Metadata } from "next";
import Callout from "@/components/Callout";
import InlineCode from "@/components/InlineCode";
import StepFlow from "@/components/StepFlow";

export const metadata: Metadata = {
  title: "Overview — Peroxo Docs",
  description:
    "Learn what Peroxo is, how it fits into your stack, and what you need to get started.",
};

export default function OverviewPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">Overview</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        Peroxo is a real-time messaging backend designed to be embedded into your
        application. It handles WebSocket connections, message routing,
        persistence, and delivery — you provide the users and the UI.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">What Peroxo Is</h2>
      <ul className="mt-3 space-y-2 text-text-muted list-disc pl-5 leading-relaxed">
        <li>
          A WebSocket gateway that routes messages between users in real time
        </li>
        <li>
          An actor-based server written in Rust, using Tokio for async I/O
        </li>
        <li>
          A multi-tenant system where each tenant gets a{" "}
          <InlineCode>project_id</InlineCode>{" "}
          that isolates their users and data
        </li>
        <li>
          A persistence layer backed by ScyllaDB for message history and sync
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-text mt-10">What Peroxo Is Not</h2>
      <ul className="mt-3 space-y-2 text-text-muted list-disc pl-5 leading-relaxed">
        <li>
          Not a user authentication system — you bring your own login/signup flow
        </li>
        <li>
          Not a UI library — you build the frontend; Peroxo is the backend
        </li>
        <li>
          Not a push notification service — it handles real-time WebSocket
          delivery only
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-text mt-10">Service Topology</h2>
      <p className="mt-3 text-text-muted leading-relaxed">
        Your client app talks to exactly two services:
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-accent text-left">
              <th className="px-4 py-3 font-semibold text-text">Service</th>
              <th className="px-4 py-3 font-semibold text-text">URL</th>
              <th className="px-4 py-3 font-semibold text-text">Transport</th>
              <th className="px-4 py-3 font-semibold text-text">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-text">Auth Service</td>
              <td className="px-4 py-3">
                <InlineCode>https://auth.mutref.tech</InlineCode>
              </td>
              <td className="px-4 py-3 text-text-muted">HTTPS</td>
              <td className="px-4 py-3 text-text-muted">
                Mint and verify user session tokens
              </td>
            </tr>
            <tr className="border-b border-border bg-bg">
              <td className="px-4 py-3 text-text">Peroxo Gateway</td>
              <td className="px-4 py-3">
                <InlineCode>wss://peroxo.mutref.tech</InlineCode>
              </td>
              <td className="px-4 py-3 text-text-muted">WSS (WebSocket)</td>
              <td className="px-4 py-3 text-text-muted">
                Real-time messaging, conversations, history
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-text-muted">
        The gateway also exposes one HTTP endpoint for conversation management at
        the same origin.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">What You Need</h2>
      <p className="mt-3 text-text-muted leading-relaxed">
        To integrate Peroxo, you need two credentials obtained during tenant
        provisioning:
      </p>
      <ul className="mt-3 space-y-2 text-text-muted list-disc pl-5 leading-relaxed">
        <li>
          <InlineCode>project_id</InlineCode> — format:{" "}
          <InlineCode>peroxo_pj_&lt;nanoid&gt;</InlineCode> — identifies your
          project/tenant
        </li>
        <li>
          <InlineCode>secret_api_key</InlineCode> — format:{" "}
          <InlineCode>peroxo_&lt;40 alphanumeric chars&gt;</InlineCode> — used to
          mint user tokens
        </li>
      </ul>

      <Callout variant="warning" title="Keep your secret key safe">
        Never expose <InlineCode>secret_api_key</InlineCode> to end users or frontend
        code. Token minting should happen from your backend server.
      </Callout>

      <h2 className="text-2xl font-bold text-text mt-10">
        Complete Integration Lifecycle
      </h2>

      <h3 className="text-lg font-semibold text-text mt-6">Startup / Login</h3>
      <StepFlow
        steps={[
          {
            title: "Authenticate the user",
            description:
              "Your app authenticates the user through your own auth system. Peroxo does not handle login.",
          },
          {
            title: "Mint a token",
            description: (
              <>
                Your backend calls POST{" "}
                <InlineCode>https://auth.mutref.tech/generate-user-token</InlineCode>{" "}
                with the user&apos;s ID and receives a{" "}
                <InlineCode>pxtok_...</InlineCode> token.
              </>
            ),
          },
          {
            title: "Send token to client",
            description: "Your backend sends the token to the client.",
          },
          {
            title: "Connect WebSocket",
            description: (
              <>
                Client opens WebSocket:{" "}
                <InlineCode>wss://peroxo.mutref.tech/ws?token=pxtok_...</InlineCode>
              </>
            ),
          },
        ]}
      />

      <h3 className="text-lg font-semibold text-text mt-6">Opening a Chat</h3>
      <StepFlow
        steps={[
          {
            title: "Get conversation ID",
            description: (
              <>
                Client calls GET{" "}
                <InlineCode>https://peroxo.mutref.tech/conversations</InlineCode> with{" "}
                <InlineCode>project_id</InlineCode> and both user IDs to receive a{" "}
                <InlineCode>conversation_id</InlineCode>.
              </>
            ),
          },
          {
            title: "Load history",
            description: (
              <>
                Client sends <InlineCode>GetPaginatedMessages</InlineCode> with{" "}
                <InlineCode>message_id: null</InlineCode> to receive the first page of
                messages.
              </>
            ),
          },
          {
            title: "Listen for real-time messages",
            description:
              "Client renders messages and listens for incoming DirectMessage events.",
          },
        ]}
      />

      <h3 className="text-lg font-semibold text-text mt-6">
        Sending a Message
      </h3>
      <StepFlow
        steps={[
          {
            title: "Generate client_message_id",
            description: "Client generates a UUID v4 as client_message_id.",
          },
          {
            title: "Send over WebSocket",
            description:
              'Client sends SendDirectMessage and shows the message in "sending" state.',
          },
          {
            title: "Handle acknowledgment",
            description:
              'On MessageAck with matching client_message_id: "Persisted" marks as sent; { "Failed": "..." } shows an error with retry.',
          },
        ]}
      />
    </>
  );
}
