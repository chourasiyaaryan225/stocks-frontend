"use client";

import { useEffect, useState } from "react";
import useApi from "@/app/hooks/useApi";
import Modal from "@/app/components/Modal";

export default function CreateAlertModal({ isOpen, onClose, userEmail, stockData, onAlertResult }) {
  const [condition, setCondition] = useState("GREATER_THAN");
  const [targetPrice, setTargetPrice] = useState("");
  const [localError, setLocalError] = useState("");
  const { request: createAlertRequest, loading: isCreatingAlert, error: apiError } = useApi();

  const resetForm = () => {
    setCondition("GREATER_THAN");
    setTargetPrice("");
    setLocalError("");
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!targetPrice || isNaN(parseFloat(targetPrice))) {
      setLocalError("Please enter a valid numeric target price.");
      return;
    }

    if (!userEmail || !stockData) {
      onAlertResult({ type: "error", message: "Unable to create alert: missing user or stock data." });
      onClose();
      return;
    }

    const details = stockData?.details || stockData || {};
    const payload = {
      user: userEmail,
      symbol: stockData?.symbol,
      companyName: details.name || details.companyName || stockData?.symbol,
      condition,
      targetPrice: Number(targetPrice),
    };

    const response = await createAlertRequest({
      method: "POST",
      url: "/user/createAlert",
      data: payload,
    });

    const successMessage = `Alert created for ${payload.symbol} ${condition === "GREATER_THAN" ? "above" : "below"} $${payload.targetPrice}.`;
    const errorMessage = apiError?.message || apiError || "Failed to create alert. Please try again.";

    if (response) {
      onAlertResult({ type: "success", message: successMessage });
      resetForm();
    } else {
      onAlertResult({ type: "error", message: errorMessage });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Create Price Alert" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Stock Symbol</label>
          <input
            type="text"
            value={stockData?.symbol || ""}
            disabled
            className="w-full rounded-2xl border border-gray-300 bg-slate-100 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f77f00]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f77f00]"
          >
            <option value="GREATER_THAN">Greater Than</option>
            <option value="LESS_THAN">Less Than</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Target Price</label>
          <input
            type="number"
            step="0.01"
            value={targetPrice}
            onChange={(event) => setTargetPrice(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f77f00]"
            placeholder="Enter a target price"
          />
        </div>

        {localError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {localError}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreatingAlert}
            className="rounded-2xl bg-[#003049] px-6 py-3 text-white transition hover:bg-[#062f4a] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCreatingAlert ? "Creating..." : "Create Alert"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
