"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import useFetch from "@/app/hooks/useSwr";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import useApi from "@/app/hooks/useApi";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import WatchListCard from "@/app/components/WatchListCard";
import WatchListEmptyState from "@/app/components/WatchListEmptyState";
import AlertBox from "@/app/components/alert";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function WatchListPage() {
  const { user } = useLocalStorage();
  const userEmail = user?.id;

  const { request, loading: apiLoading } = useApi();

  const [alert, setAlert] = useState(null);

  // Fetch watchlist data
  const { data: watchListData, isLoading, error, mutate } = useFetch(
    userEmail ? `/user/userWatchList/${userEmail}` : null,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const watchList = watchListData?.data || [];

  const handleDeleteFromWatchlist = async (symbol) => {
    try {
      const response = await request({
        method: "DELETE",
        url: "/user/removeFromWatchList",
        data: { user: userEmail, symbol },
      });

      if (response?.status === "success") {
        setAlert({
          type: "success",
          message: "Stock removed from watchlist successfully!",
        });

        mutate();
      } else {
        setAlert({
          type: "error",
          message:
            response?.message || "Failed to remove stock from watchlist",
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: "An error occurred while removing the stock",
      });
    }
  };

  const closeAlert = () => setAlert(null);

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <ErrorMessage message={error.message} />
        <Footer />
      </>
    );
  }

  if (!userEmail) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-yellow-600 mb-2">
                Please Log In
              </h2>

              <p className="text-yellow-500 mb-6">
                You need to log in to view your watchlist
              </p>

              <Link
                href="/login"
                className="inline-block bg-[#f77f00] hover:bg-[#e56f00] text-white px-8 py-3 rounded-2xl font-bold transition-all"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <ProtectedRoute>
      <Header />

      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <AlertBox
            type={alert.type}
            message={alert.message}
            onClose={closeAlert}
            duration={3000}
          />
        </div>
      )}

      <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12 px-10">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#003049] mb-2">
            My Watchlist
          </h1>

          <p className="text-gray-600 text-lg">
            Track stocks you're interested in
          </p>

          <p className="text-gray-500 text-sm mt-2">
            {watchList.length} stock
            {watchList.length !== 1 ? "s" : ""} added
          </p>
        </div>

        {watchList.length === 0 ? (
          <WatchListEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchList.map((stock, index) => (
              <WatchListCard
                key={stock.symbol ?? index}
                stock={stock}
                onDelete={handleDeleteFromWatchlist}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </ProtectedRoute>
  );
}