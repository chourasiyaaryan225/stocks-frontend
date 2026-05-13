"use client";

export default function ErrorMessage({ title = "Error Loading Watchlist", message = "Something went wrong." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">{title}</h2>
          <p className="text-red-500">{message}</p>
        </div>
      </div>
    </div>
  );
}
