"use client";

import { useState } from "react";
import { FiTrash2, FiCheckCircle, FiClock } from "react-icons/fi";
import useFetch from "@/app/hooks/useSwr";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import useApi from "@/app/hooks/useApi";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import AlertBox from "@/app/components/alert";

export default function AlertsList() {
  const { user } = useLocalStorage();
  const userEmail = user?.id;
  const { request, loading: apiLoading } = useApi();
  const [alert, setAlert] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Fetch alerts data with 10-second refresh
  const { data: alertsData, isLoading, error, mutate } = useFetch(
    userEmail ? `/user/alerts/${userEmail}` : null,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const alerts = alertsData?.data || [];

  const handleDeleteAlert = async (alertId) => {
    if (deletingIds.has(alertId)) return; // Prevent multiple clicks

    setDeletingIds(prev => new Set(prev).add(alertId));

    try {
      const response = await request({
        method: "DELETE",
        url: `/user/deleteAlert/${alertId}`,
      });

      if (response?.status === "success") {
        setAlert({ type: "success", message: "Alert deleted successfully!" });
        mutate(); // Refetch alerts data
      } else {
        setAlert({ type: "error", message: response?.message || "Failed to delete alert" });
      }
    } catch (err) {
      setAlert({ type: "error", message: "An error occurred while deleting the alert" });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const closeAlert = () => setAlert(null);

  if (isLoading) {
    return <Loading message="Loading your alerts..." />;
  }

  if (error) {
    return <ErrorMessage title="Error Loading Alerts" message={error.message} />;
  }

  if (alerts.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-16 text-center">
            <FiClock className="mx-auto text-6xl text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-[#003049] mb-3">No Alerts Yet</h2>
            <p className="text-gray-600">Create price alerts to get notified when stocks reach your target prices</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ffffff] to-[#f9f9f9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#003049] mb-2">My Alerts</h1>
          <p className="text-gray-600 text-lg">Monitor your price alerts and get notified</p>
          <p className="text-gray-500 text-sm mt-2">
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''} active
          </p>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alertItem) => (
            <AlertCard
              key={alertItem._id}
              alert={alertItem}
              onDelete={handleDeleteAlert}
              isDeleting={deletingIds.has(alertItem._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert, onDelete, isDeleting }) {
  const isTriggered = alert.isTriggered;
  const conditionText = alert.condition === "GREATER_THAN" ? "Above" : "Below";

  return (
    <div className={`bg-white rounded-2xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl ${
      isTriggered ? "border-green-200 bg-green-50/30" : "border-gray-100"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#f77f00]/10 p-2 rounded-lg shrink-0">
            <div className="w-8 h-8 flex items-center justify-center text-[#f77f00] font-bold">
              {alert.symbol?.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#003049]">{alert.symbol}</h3>
            <p className="text-sm text-gray-600">{alert.companyName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Trigger Status */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isTriggered
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {isTriggered ? (
              <FiCheckCircle size={12} />
            ) : (
              <FiClock size={12} />
            )}
            {isTriggered ? "Triggered" : "Active"}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(alert._id)}
            disabled={isDeleting}
            className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Alert Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Condition</span>
          <span className="font-semibold text-[#003049]">
            {conditionText} ${alert.targetPrice}
          </span>
        </div>

        {isTriggered && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Triggered Price</span>
              <span className="font-semibold text-green-600">
                ${alert.triggeredPrice}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Triggered At</span>
              <span className="font-semibold text-[#003049]">
                {new Date(alert.triggeredAt).toLocaleString()}
              </span>
            </div>
          </>
        )}

        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Created</span>
            <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
