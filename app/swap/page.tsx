"use client";

import SigpassKit from "@/components/sigpasskit-alt";
import Navbar from "@/components/navbar";
import SwapComponent from "@/components/swap-component";

export default function SwapPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[768px] mx-auto min-h-screen items-center justify-center">
      <SigpassKit />
      <Navbar />
      <h1 className="text-2xl font-bold">Swap</h1>
      <SwapComponent />
    </div>
  );
}
