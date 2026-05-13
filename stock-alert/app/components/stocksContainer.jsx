"use client"
import stocks from '../data/stocks.json';
import StockCard from "../components/stockCard";
import { useState,useEffect } from 'react';
import Loading from './Loading';
import useFetch from '../hooks/useSwr';
import { FiSearch } from 'react-icons/fi';

const StocksContainer = ()=>{
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch all stocks or search results
    const {data, error, isLoading} = useFetch(
        debouncedQuery ? `/stocks/search?q=${debouncedQuery}` : '/stocks/getStocks',
        debouncedQuery ? {} : {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000, // 5 minutes cache
            focusThrottleInterval: 300000,
        }
    );

    const stocksData = data?.data || [];

    return(
        <div className='px-10 py-6'>
            <h1 className="text-4xl font-bold text-center mb-10 text-[#0B2E33]">
                Stock Dashboard
            </h1>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00] focus:border-transparent text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Results Section */}
            {isLoading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <Loading message={debouncedQuery ? 'Searching stocks...' : 'Loading stocks...'}></Loading>
                </div>
            ) : error ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md">
                    {error?.response?.data?.message ||
                        error?.message ||
                        "Failed to load stocks."}
                    </div>
                </div>
            ) : stocksData.length === 0 && debouncedQuery ? (
                <div className="text-center py-12">
                    <FiSearch className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No stocks found</h3>
                    <p className="text-gray-500">Try searching with a different term</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {stocksData.map((stock, index) => (
                         <StockCard key={stock.symbol || index} stock={stock} />
                    ))}
                </div>
            )}
        </div>
    )
}
export default StocksContainer;