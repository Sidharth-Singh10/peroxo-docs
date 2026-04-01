export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Overview", href: "/docs/overview" },
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Get API Keys", href: "/docs/get-api-keys" },
      { title: "WebSocket Connection", href: "/docs/websocket-connection" },
    ],
  },
  {
    title: "Messaging",
    items: [
      { title: "Conversations", href: "/docs/conversations" },
      { title: "Direct Messaging", href: "/docs/direct-messaging" },
      { title: "Message History", href: "/docs/message-history" },
      { title: "Reconnection & Sync", href: "/docs/reconnection" },
      { title: "Room Messaging", href: "/docs/rooms" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "API Reference", href: "/docs/api-reference" },
      { title: "Error Handling", href: "/docs/error-handling" },
    ],
  },
];

export function flatNavItems(): NavItem[] {
  return navigation.flatMap((group) => group.items);
}

export function getPrevNext(currentHref: string) {
  const items = flatNavItems();
  const idx = items.findIndex((item) => item.href === currentHref);
  return {
    prev: idx > 0 ? items[idx - 1] : null,
    next: idx < items.length - 1 ? items[idx + 1] : null,
  };
}
