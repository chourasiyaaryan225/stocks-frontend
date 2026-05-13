import Image from "next/image";
import Link from "next/link";
import { FiTrendingUp } from "react-icons/fi";

const StockCard = ({ stock }) => {
  const { symbol, details } = stock;

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl border border-[#f77f0020] shadow-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* Top Section */}
      <div className="flex items-center justify-between">

        {/* Logo + Name */}
        <div className="flex items-center gap-4">

          <div className="bg-[#fff4e6] p-3 rounded-2xl border border-[#f77f0020]">
            {stock?.details.logo ? 
            <Image
              src={stock?.details?.logo}
              alt={stock?.details?.name}
              width={45}
              height={45}
              className="object-contain"
            />
            : 
            <div className="text-black">{symbol}</div>
          }

          </div>

          <div>

            <h2 className="text-xl font-bold text-[#0B2E33] font-[Poppins]">
              {details.name}
            </h2>

            <p className="text-sm text-[#f77f00] font-medium">
              {symbol}
            </p>

          </div>

        </div>

        {/* Industry */}
        <div className="bg-[#fff4e6] text-[#f77f00] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">

          <FiTrendingUp />

          Tech

        </div>

      </div>

      {/* Details */}
      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="bg-[#fff8f0] rounded-2xl p-4 border border-[#f77f0010]">

          <p className="text-sm text-gray-500">
            Country
          </p>

          <h3 className="text-lg font-bold text-[#003049] mt-1">
            {details.country}
          </h3>

        </div>

        <div className="bg-[#fff8f0] rounded-2xl p-4 border border-[#f77f0010]">

          <p className="text-sm text-gray-500">
            Currency
          </p>

          <h3 className="text-lg font-bold text-[#003049] mt-1">
            {details.currency}
          </h3>

        </div>

        <div className="bg-[#fff8f0] rounded-2xl p-4 border border-[#f77f0010] col-span-2">

          <p className="text-sm text-gray-500">
            Exchange
          </p>

          <h3 className="text-base font-bold text-[#003049] mt-1">
            {details.exchange}
          </h3>

        </div>

      </div>

      {/* Bottom */}
      <div className="mt-8 flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            IPO Date
          </p>

          <h3 className="text-[#0B2E33] font-semibold mt-1">
            {details.ipo}
          </h3>

        </div>

        <Link
          href={{
            pathname: `/stockDetails`,
            query: { data: JSON.stringify(stock) }
          }}
          className="bg-[#f77f00] hover:bg-[#e56f00] text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md"
        >
          View Stock
        </Link>

      </div>

    </div>
  );
};

export default StockCard;