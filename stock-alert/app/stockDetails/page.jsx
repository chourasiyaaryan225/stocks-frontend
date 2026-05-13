"use client";

import { Suspense } from "react";
import StockDetailsContent from "./StockDetailsContent";

export default function StockDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f77f00] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading stock details...</p>
        </div>
      </div>
    }>
      <StockDetailsContent />
    </Suspense>
  );
}
