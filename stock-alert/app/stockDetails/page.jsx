"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import StockDetails from "../components/stockDetails";
import ProtectedRoute from "../components/ProtectedRoute";
export default function StockDetailsPage() {
  const searchParams = useSearchParams();
  const [stockData, setStockData] = useState(null);
  const [parseError, setParseError] = useState(false);

  // Parse URL data on mount
  useEffect(() => {
    try {
      const urlData = searchParams.get("data");
      if (urlData) {
        const parsedStock = JSON.parse(decodeURIComponent(urlData));
        setStockData(parsedStock);
      }
    } catch (error) {
      console.error("Error parsing stock data:", error);
      setParseError(true);
    }
  }, [searchParams]);

  if (parseError || !stockData) {
    return (
      <ProtectedRoute>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading stock</h1>
            <p className="text-gray-600 mt-2">Invalid stock data</p>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      <StockDetails stockData={stockData} />
      <Footer />
    </ProtectedRoute>
  );
}
