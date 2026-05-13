"use client";

import Image from "next/image";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useState, useEffect } from "react";
import useFetch from "@/app/hooks/useSwr";
import useApi from "@/app/hooks/useApi";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import AlertBox from "@/app/components/alert";
import CreateAlertModal from "@/app/components/CreateAlertModal";
import BuyStockModal from "@/app/components/BuyStockModal";

export default function StockDetails({ stockData: initialStockData }) {
  const [stockData, setStockData] = useState(initialStockData || null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [showBuyStockModal, setShowBuyStockModal] = useState(false);
  const [showAlertToast, setShowAlertToast] = useState(false);
  const [alertToastType, setAlertToastType] = useState("success");
  const [alertToastMessage, setAlertToastMessage] = useState("");

  const { request: addToWatchList, loading: isAddingToWatchList } = useApi();
  const { user } = useLocalStorage();

  // Fetch stock details from API
  const { data: apiData, isLoading, error } = useFetch(
    stockData?.symbol ? `/stocks/getStocksDetails/${stockData?.symbol}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Handle Add to Watchlist
  const handleAddToWatchList = async () => {
    if (!user || !stockData) {
      setModalMessage("User data not available. Please log in again.");
      setIsSuccess(false);
      setModalOpen(true);
      return;
    }

    try {
      const details = stockData?.details || stockData || {};
      const response = await addToWatchList({
        method: "POST",
        url: "/user/addToWatchList",
        data: {
          user: user?.id,
          symbol: stockData?.symbol,
          companyName: details.name,
          companyLogo: details.logo,
          exchange: details.exchange,
          country: details.country,
          currency: details.currency,
        },
      });

      if (response) {
        setModalMessage(`${stockData?.symbol} added to your watchlist!`);
        setIsSuccess(true);
      }
    } catch (error) {
      setModalMessage("Failed to add to watchlist. Please try again.");
      setIsSuccess(false);
    }
    setModalOpen(true);
  };

  const handleAlertResult = ({ type, message }) => {
    setAlertToastType(type);
    setAlertToastMessage(message);
    setShowAlertToast(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f77f00]"></div>
          <p className="mt-4 text-gray-600">Loading stock details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error loading stock</h1>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!stockData && !apiData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error loading stock</h1>
          <p className="text-gray-600 mt-2">Stock data not available</p>
        </div>
      </div>
    );
  }

  // Use URL data for details, API data for price info
  const details = stockData?.details || stockData || {};
  const priceData = apiData?.data || {};

  const stockName = details?.name || stockData?.symbol;
  const stockLogo = details?.logo;
  const industry = details?.finnhubIndustry || "N/A";
  const country = details?.country || "N/A";
  const currency = details?.currency || "N/A";
  const exchange = details?.exchange || "N/A";
  const ipo = details?.ipo || "N/A";
  const marketCap = details?.marketCapitalization
    ? `$${(details.marketCapitalization / 1000).toFixed(2)}B`
    : "N/A";
  const phone = details?.phone || "N/A";
  const weburl = details?.weburl;
  const shareOutstanding = details?.shareOutstanding || "N/A";

  // Price data from API
  const currentPrice = priceData.currentPrice ? `$${priceData.currentPrice}` : "N/A";
  const high = priceData.high ? `$${priceData.high}` : "N/A";
  const low = priceData.low ? `$${priceData.low}` : "N/A";
  const open = priceData.open ? `$${priceData.open}` : "N/A";
  const previousClose = priceData.previousClose ? `$${priceData.previousClose}` : "N/A";
  const percentageValue = parseFloat(priceData.percentageChange) || 0;
  const isPositive = percentageValue >= 0;
  const percentageChange = `${percentageValue > 0 ? '+' : ''}${percentageValue}%`;

  return (
    <>
      {showAlertToast && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute top-6 right-6 w-full max-w-sm pointer-events-auto">
            <AlertBox
              type={alertToastType}
              message={alertToastMessage}
              onClose={() => setShowAlertToast(false)}
              duration={5000}
            />
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute top-6 right-6 w-full max-w-sm pointer-events-auto">
            <AlertBox
              type={isSuccess ? "success" : "error"}
              message={modalMessage}
              onClose={() => setModalOpen(false)}
              duration={5000}
            />
          </div>
        </div>
      )}
      <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="bg-linear-to-r from-[#003049] to-[#004d6d] rounded-3xl shadow-2xl p-8 sm:p-12 mb-8 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <div className="text-9xl font-bold">{stockData?.symbol}</div>
            </div>
            
            <div className="flex items-start justify-between gap-6 relative z-10">
              {/* Left Section - Logo and Details */}
              <div className="flex items-start gap-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                  {stockLogo ? (
                    <Image
                      src={stockLogo}
                      alt={stockName}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center text-4xl font-bold text-white">
                      {stockData?.symbol}
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <h1 className="text-5xl font-bold mb-2">{stockName}</h1>
                  <p className="text-xl text-gray-200 mb-4">{stockData?.symbol}</p>
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <FiTrendingUp className="text-yellow-400" />
                    <span className="font-semibold">{industry}</span>
                  </div>
                </div>
              </div>

              {/* Right Section - Price */}
              <div className="text-right pt-4">
                <p className="text-gray-200 text-sm font-medium mb-2">Current Price</p>
                <h2 className="text-6xl font-bold mb-3">{currentPrice}</h2>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${isPositive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'}`}>
                  {isPositive ? <FiTrendingUp size={24} /> : <FiTrendingDown size={24} />}
                  {percentageChange}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* High */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <p className="text-gray-600 text-sm font-medium mb-2">Day High</p>
              <h3 className="text-3xl font-bold text-[#003049]">{high}</h3>
            </div>

            {/* Low */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <p className="text-gray-600 text-sm font-medium mb-2">Day Low</p>
              <h3 className="text-3xl font-bold text-[#003049]">{low}</h3>
            </div>

            {/* Open */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <p className="text-gray-600 text-sm font-medium mb-2">Open Price</p>
              <h3 className="text-3xl font-bold text-[#003049]">{open}</h3>
            </div>

            {/* Previous Close */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <p className="text-gray-600 text-sm font-medium mb-2">Previous Close</p>
              <h3 className="text-3xl font-bold text-[#003049]">{previousClose}</h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShowBuyStockModal(true)}
              className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <FiTrendingUp />
              Buy Stock
            </button>
            <button
              onClick={handleAddToWatchList}
              disabled={isAddingToWatchList}
              className="bg-linear-to-r from-[#f77f00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToWatchList ? "Adding..." : "Add to Watchlist"}
            </button>
            <button
              onClick={() => setShowCreateAlertModal(true)}
              className="bg-linear-to-r from-[#003049] to-blue-900 hover:from-blue-900 hover:to-indigo-900 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Alert
            </button>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Country */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-3">Country</p>
                <h3 className="text-2xl font-bold text-[#003049]">{country}</h3>
              </div>

              {/* Currency */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-3">Currency</p>
                <h3 className="text-2xl font-bold text-[#003049]">{currency}</h3>
              </div>

              {/* Exchange */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-3">Exchange</p>
                <h3 className="text-lg font-bold text-[#003049]">{exchange}</h3>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* IPO Date */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-3">IPO Date</p>
                <h3 className="text-2xl font-bold text-[#003049]">{ipo}</h3>
              </div>

              {/* Market Cap */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-3">Market Capitalization</p>
                <h3 className="text-2xl font-bold text-[#003049]">{marketCap}</h3>
              </div>

              {/* Share Outstanding */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-3">Share Outstanding</p>
                <h3 className="text-2xl font-bold text-[#003049]">{shareOutstanding}</h3>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <p className="text-gray-600 text-sm font-medium mb-3">Contact Phone</p>
              <h3 className="text-xl font-bold text-[#003049]">{phone}</h3>
            </div>

            {/* Website */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <p className="text-gray-600 text-sm font-medium mb-3">Official Website</p>
              {weburl ? (
                <a
                  href={weburl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f77f00] hover:text-[#e56f00] font-bold text-lg inline-flex items-center gap-2 transition-colors"
                >
                  Visit Website →
                </a>
              ) : (
                <p className="text-[#003049] text-lg">N/A</p>
              )}
            </div>
          </div>

        </div>
      </div>
      <BuyStockModal
        isOpen={showBuyStockModal}
        onClose={() => setShowBuyStockModal(false)}
        userEmail={user?.id}
        stockData={stockData}
        currentPrice={priceData.currentPrice}
        onResult={handleAlertResult}
      />
      <CreateAlertModal
        isOpen={showCreateAlertModal}
        onClose={() => setShowCreateAlertModal(false)}
        userEmail={user?.id}
        stockData={stockData}
        onAlertResult={handleAlertResult}
      />
    </>
  );
}
