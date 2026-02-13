"use client";

import { AppSidebar, BookContextProvider } from "@/components/app-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookContextProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">{children}</main>
      </div>
    </BookContextProvider>
  );
}
