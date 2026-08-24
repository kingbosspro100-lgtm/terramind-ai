"use client";

import { useState } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import Header from "@/app/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B0914] text-slate-100 selection:bg-emerald-600 selection:text-white">

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-1 flex-col min-w-0 lg:ml-72 transition-all duration-300">

        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
          {children}
        </main>

      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

    </div>
  );
}