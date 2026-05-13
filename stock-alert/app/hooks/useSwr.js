"use client";
import useSWR from "swr";
import interceptor from "../services/interceptor";
const fetcher = async (url) => {
  const response = await interceptor.get(url);
  return response.data;
};

const useFetch = (url, options = {}) => {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR(url, fetcher, options);
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useFetch;