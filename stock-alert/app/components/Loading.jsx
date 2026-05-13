"use client";

export default function Loading({ message = "Loading your watchlist..." }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#f77f00] border-t-transparent"></div>
        <p className="mt-6 text-gray-600 text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
}
