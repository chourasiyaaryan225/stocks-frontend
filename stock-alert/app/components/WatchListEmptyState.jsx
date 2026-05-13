"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function WatchListEmptyState() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-16 text-center">
      <div className="inline-block bg-[#f77f00]/10 p-6 rounded-full mb-6">
        <FiPlus size={48} className="text-[#f77f00]" />
      </div>
      <h2 className="text-2xl font-bold text-[#003049] mb-3">Your watchlist is empty</h2>
      <p className="text-gray-600 mb-8">Start adding stocks you want to track</p>
      <Link
        href="/dashboard"
        className="inline-block bg-[#f77f00] hover:bg-[#e56f00] text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl"
      >
        Browse Stocks
      </Link>
    </div>
  );
}
