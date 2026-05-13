"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

export default function WatchListCard({ stock, onDelete }) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(stock.symbol);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-[#f77f00]/10 p-3 rounded-xl shrink-0">
            {stock.companyLogo ? (
              <Image
                src={stock?.companyLogo}
                alt={stock?.symbol}
                width={50}
                height={50}
                className="object-contain"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center text-[#f77f00] font-bold text-lg">
                {stock?.symbol?.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#003049] truncate">{stock?.symbol}</h3>
            <p className="text-sm text-gray-600 truncate">{stock?.companyName}</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="ml-2 p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600 transition-colors shrink-0"
        >
          <FiTrash2 size={20} />
        </button>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Exchange</span>
          <span className="font-semibold text-[#003049]">{stock?.exchange}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Country</span>
          <span className="font-semibold text-[#003049]">{stock?.country}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Currency</span>
          <span className="font-semibold text-[#003049]">{stock?.currency}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Added: {new Date(stock?.updatedAt).toLocaleDateString()}
      </p>

      <Link
        href={`/stockDetails?data=${encodeURIComponent(JSON.stringify({ symbol: stock?.symbol, details: stock }))}`}
        className="w-full px-5 py-3 rounded-2xl bg-linear-to-r from-[#f77f00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 rounded-lg font-bold transition-all text-center text-sm"
      >
        View Details
      </Link>
    </div>
  );
}
