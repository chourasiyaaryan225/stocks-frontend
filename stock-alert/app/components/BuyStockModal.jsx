"use client";

import { useEffect, useState } from "react";
import useApi from "@/app/hooks/useApi";
import Modal from "@/app/components/Modal";

export default function BuyStockModal({ isOpen, onClose, userEmail, stockData, currentPrice, onResult }) {
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [localError, setLocalError] = useState("");
  const { request: addHoldingRequest, loading: isBuying, error: apiError } = useApi();

  useEffect(() => {
    if (isOpen) {
      setQuantity("");
      setBuyPrice(currentPrice != null ? String(currentPrice) : "");
      setLocalError("");
    }
  }, [isOpen, currentPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!quantity || isNaN(parseFloat(quantity)) || Number(quantity) < 1) {
      setLocalError("Quantity must be 1 or greater.");
      return;
    }

    if (currentPrice == null || isNaN(parseFloat(currentPrice)) || Number(currentPrice) <= 0) {
      setLocalError("Unable to determine current stock price. Please refresh and try again.");
      return;
    }

    if (!buyPrice || isNaN(parseFloat(buyPrice)) || Number(buyPrice) <= 0) {
      setLocalError("Invalid buy price.");
      return;
    }

    if (!userEmail || !stockData) {
      onResult({ type: "error", message: "Unable to buy stock: missing user or stock data." });
      onClose();
      return;
    }

    const details = stockData?.details || stockData || {};
    const payload = {
      user: userEmail,
      symbol: stockData?.symbol,
      companyName: details.name || details.companyName || stockData?.symbol,
      companyLogo: details.logo || details.companyLogo || "",
      exchange: details.exchange || "",
      currency: details.currency || "",
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
    };

    const response = await addHoldingRequest({
      method: "POST",
      url: "/user/addHolding",
      data: payload,
    });

    const successMessage = `Bought ${payload.quantity} ${payload.symbol} at $${payload.buyPrice}.`;
    const errorMessage = apiError?.message || apiError || "Failed to buy stock. Please try again.";

    if (response) {
      onResult({ type: "success", message: successMessage });
    } else {
      onResult({ type: "error", message: errorMessage });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Buy Stock" onClose={onClose}>
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
          <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
          <input
            type="number"
            step="1"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f77f00]"
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Buy Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={buyPrice}
            readOnly
            disabled
            className="w-full rounded-2xl border border-gray-300 bg-slate-100 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f77f00]"
            placeholder="Current stock price"
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
            disabled={isBuying}
            className="rounded-2xl bg-[#003049] px-6 py-3 text-white transition hover:bg-[#062f4a] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isBuying ? "Buying..." : "Confirm Buy"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
