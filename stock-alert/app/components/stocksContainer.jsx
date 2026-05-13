"use client"
import stocks from '../data/stocks.json';
import StockCard from "../components/stockCard";
import { useState,useEffect } from 'react';
import Loading from './Loading';
import useFetch from '../hooks/useSwr';
const StocksContainer = ()=>{
    const {data,error,isLoading} = useFetch('/stocks/getStocks',{});
    if (isLoading) {
        return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loading message='Loading stocks...'></Loading>
        </div>
        );
    }

    if (error) {
        return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md">
            {error?.response?.data?.message ||
                error?.message ||
                "Failed to load stocks."}
            </div>
        </div>
        );
    }
    return(
        <div className='px-10 py-6'>
            <h1 className="text-4xl font-bold text-center mb-10 text-[#0B2E33]">
                Stock Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {data?.data?.map((stock, index) => (
                     <StockCard key={index} stock={stock} /> 
                ))}
            </div>
        </div>
    )
}
export default StocksContainer;