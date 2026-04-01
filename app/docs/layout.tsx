import Sidebar from "@/components/Sidebar";
import PrevNextNav from "@/components/PrevNextNav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 min-w-0 px-6 py-10 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {children}
          <PrevNextNav />
        </div>
      </main>
    </div>
  );
}
