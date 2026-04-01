import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import EndpointCard from "@/components/EndpointCard";
import InlineCode from "@/components/InlineCode";

export const metadata: Metadata = {
  title: "Conversations — Peroxo Docs",
  description:
    "How to get or create conversations between user pairs in Peroxo.",
};

export default function ConversationsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text">Conversations</h1>
      <p className="mt-4 text-text-muted leading-relaxed">
        Before sending direct messages, you need a{" "}
        <InlineCode>
          conversation_id
        </InlineCode>{" "}
        for the user pair. This endpoint creates a conversation if one
        doesn&apos;t exist, or returns the existing one.
      </p>

      <h2 className="text-2xl font-bold text-text mt-10">
        Get or Create a Conversation
      </h2>
      <EndpointCard
        method="GET"
        path="https://peroxo.mutref.tech/conversations?project_id=<string>&user_id_1=<string>&user_id_2=<string>"
        description="Retrieve or create a conversation between two users. The server lexicographically sorts the two user IDs, so the order you pass them in doesn't matter."
      >
        <div className="pt-4">
          <p className="text-sm text-text-muted mb-4">
            All three query parameters are required. The order of user_id_1 and
            user_id_2 does not matter —{" "}
            <InlineCode>
              user_id_1=alice&amp;user_id_2=bob
            </InlineCode>{" "}
            and{" "}
            <InlineCode>
              user_id_1=bob&amp;user_id_2=alice
            </InlineCode>{" "}
            return the same conversation.
          </p>

          <h4 className="font-semibold text-sm text-text mb-2">
            Response (200 OK)
          </h4>
          <CodeBlock
            language="json"
            code={`{
  "success": true,
  "error_message": "",
  "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_new": false
}`}
          />

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-accent text-left">
                  <th className="px-4 py-2 font-semibold text-text">Field</th>
                  <th className="px-4 py-2 font-semibold text-text">Type</th>
                  <th className="px-4 py-2 font-semibold text-text">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2">
                    <InlineCode>
                      success
                    </InlineCode>
                  </td>
                  <td className="px-4 py-2 text-text-muted">boolean</td>
                  <td className="px-4 py-2 text-text-muted">
                    Whether the operation succeeded
                  </td>
                </tr>
                <tr className="border-b border-border bg-bg">
                  <td className="px-4 py-2">
                    <InlineCode>
                      error_message
                    </InlineCode>
                  </td>
                  <td className="px-4 py-2 text-text-muted">string</td>
                  <td className="px-4 py-2 text-text-muted">
                    Empty on success; error detail on failure
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2">
                    <InlineCode>
                      conversation_id
                    </InlineCode>
                  </td>
                  <td className="px-4 py-2 text-text-muted">string</td>
                  <td className="px-4 py-2 text-text-muted">
                    The stable UUID for this user pair&apos;s conversation
                  </td>
                </tr>
                <tr className="border-b border-border bg-bg">
                  <td className="px-4 py-2">
                    <InlineCode>
                      created_new
                    </InlineCode>
                  </td>
                  <td className="px-4 py-2 text-text-muted">boolean</td>
                  <td className="px-4 py-2 text-text-muted">
                    true if a new conversation was just created
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
                  <td className="px-4 py-2 text-text">500</td>
                  <td className="px-4 py-2 text-text-muted">
                    Backend gRPC failure — response body is JSON with success:
                    false and error_message
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </EndpointCard>

      <Callout variant="info">
        Cache the{" "}
        <InlineCode>
          conversation_id
        </InlineCode>{" "}
        locally for each user pair. It never changes once created.
      </Callout>

      <Callout variant="warning">
        This endpoint currently has <strong>no authentication</strong>. In
        production, consider proxying it through your own backend to add auth.
      </Callout>
    </>
  );
}
