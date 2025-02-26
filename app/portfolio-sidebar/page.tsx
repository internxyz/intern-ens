"use client";

import Navbar from "@/components/navbar";
import { PortfolioSidebar } from "@/components/portfolio-sidebar";

export default function PortfolioSidebarPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[768px] mx-auto min-h-screen items-center justify-center">
      <Navbar />
      <h1 className="text-2xl font-bold">Portfolio Sidebar</h1>
      <PortfolioSidebar />
    </div>
  );
}
