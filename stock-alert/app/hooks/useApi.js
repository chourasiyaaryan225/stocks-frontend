// hooks/useApi.js

"use client";

import { useState } from "react";
import interceptor from "../services/interceptor";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = async ({
    method = "GET",
    url,
    data = {},
    params = {},
    headers = {},
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await interceptor({
        method,
        url,
        data
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    request,
  };
};

export default useApi;