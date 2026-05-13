"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import useFetch from "@/app/hooks/useSwr";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";

export default function Portfolio() {
  const { user } = useLocalStorage();
  const userEmail = user?.id;

  // Fetch portfolio data with 1-second refresh interval
  const { data: portfolioData, isLoading, error } = useFetch(
    userEmail ? `/user/portfolio/${userEmail}` : null,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const holdings = portfolioData?.data?.holdings || [];
  const summary = portfolioData?.data?.summary || {
    totalInvestment: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
  };

  const profitLossPercentage =
    summary.totalInvestment > 0
      ? ((summary.totalProfitLoss / summary.totalInvestment) * 100).toFixed(2)
      : 0;

  const isProfitable = summary.totalProfitLoss >= 0;

  if (isLoading) {
    return <Loading message="Loading your portfolio..." />;
  }

  if (error) {
    return <ErrorMessage title="Error Loading Portfolio" message={error.message} />;
  }

  if (holdings.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-16 text-center">
            <h2 className="text-2xl font-bold text-[#003049] mb-3">No Holdings Yet</h2>
            <p className="text-gray-600">Start buying stocks to build your portfolio</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portfolio Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#003049] mb-2">My Portfolio</h1>
          <p className="text-gray-600 text-lg">Track and manage your stock holdings</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Investment */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Investment</p>
            <h3 className="text-3xl font-bold text-[#003049]">
              ${summary.totalInvestment.toFixed(2)}
            </h3>
            <p className="text-gray-500 text-xs mt-2">Amount invested</p>
          </div>

          {/* Total Current Value */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <p className="text-gray-600 text-sm font-medium mb-2">Current Value</p>
            <h3 className="text-3xl font-bold text-[#003049]">
              ${summary.totalCurrentValue.toFixed(2)}
            </h3>
            <p className="text-gray-500 text-xs mt-2">Market value now</p>
          </div>

          {/* Total Profit/Loss */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            isProfitable
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              isProfitable ? "text-emerald-700" : "text-red-700"
            }`}>
              Total Profit/Loss
            </p>
            <div className="flex items-center gap-2">
              <h3 className={`text-3xl font-bold ${
                isProfitable ? "text-emerald-600" : "text-red-600"
              }`}>
                ${Math.abs(summary.totalProfitLoss).toFixed(2)}
              </h3>
              {isProfitable ? (
                <FiTrendingUp className="text-emerald-600 text-2xl" />
              ) : (
                <FiTrendingDown className="text-red-600 text-2xl" />
              )}
            </div>
            <p className={`text-xs mt-2 ${
              isProfitable ? "text-emerald-600" : "text-red-600"
            }`}>
              {isProfitable ? '+' : ''}{profitLossPercentage}%
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Buy Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Current Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Invested Value
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Current Value
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Profit/Loss
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {holdings.map((holding) => {
                  const holdingProfitLoss = holding.profitLoss || 0;
                  const isProfitable = holdingProfitLoss >= 0;
                  const profitLossPercent =
                    holding.investedValue > 0
                      ? ((holdingProfitLoss / holding.investedValue) * 100).toFixed(2)
                      : 0;

                  return (
                    <tr key={holding._id} className="hover:bg-slate-50 transition-colors">
                      {/* Stock Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#f77f00]/10 p-2 rounded-lg shrink-0">
                            {holding.companyLogo ? (
                              <Image
                                src={holding.companyLogo}
                                alt={holding.symbol}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center text-[#f77f00] font-bold">
                                {holding.symbol?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#003049]">{holding.symbol}</p>
                            <p className="text-xs text-gray-500">{holding.companyName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 text-[#003049] font-medium">
                        {holding.quantity}
                      </td>

                      {/* Buy Price */}
                      <td className="px-6 py-4 text-[#003049] font-medium">
                        ${holding.buyPrice.toFixed(2)}
                      </td>

                      {/* Current Price */}
                      <td className="px-6 py-4 text-[#003049] font-medium">
                        ${holding.currentPrice.toFixed(2)}
                      </td>

                      {/* Invested Value */}
                      <td className="px-6 py-4 text-[#003049] font-medium">
                        ${holding.investedValue.toFixed(2)}
                      </td>

                      {/* Current Value */}
                      <td className="px-6 py-4 text-[#003049] font-medium">
                        ${holding.currentValue.toFixed(2)}
                      </td>

                      {/* Profit/Loss */}
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          isProfitable
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {isProfitable ? (
                            <FiTrendingUp size={16} />
                          ) : (
                            <FiTrendingDown size={16} />
                          )}
                          {isProfitable ? '+' : ''}${Math.abs(holdingProfitLoss).toFixed(2)}
                          <span className="text-xs">({isProfitable ? '+' : ''}{profitLossPercent}%)</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="bg-slate-50 border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Total Holdings</p>
                <p className="text-2xl font-bold text-[#003049]">{holdings.length}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Shares</p>
                <p className="text-2xl font-bold text-[#003049]">
                  {holdings.reduce((sum, h) => sum + h.quantity, 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg. Buy Price</p>
                <p className="text-2xl font-bold text-[#003049]">
                  $
                  {(
                    holdings.reduce((sum, h) => sum + h.buyPrice * h.quantity, 0) /
                    holdings.reduce((sum, h) => sum + h.quantity, 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
