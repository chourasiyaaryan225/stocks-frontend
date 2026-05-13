'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoNotificationsOutline, IoLogOutOutline } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import useLocalStorage from "../hooks/useLocalStorage";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();

  const { user } = useLocalStorage();

  const userName = user?.name;

  const initials = userName
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
  };

  return (
    <header className="w-full bg-white border-b border-[#e5e7eb] z-50 shadow-sm ">

      <nav className="w-full flex items-center justify-between px-5 py-2">

        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">

          {/* Logo Box */}
          <div className="bg-[#003049] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-[#f77f0030] shadow-md flex-shrink-0">
            <Image
              src="/stock.png"
              alt="Stock Logo"
              width={48}
              height={48}
              priority
              className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 object-contain rounded-sm border border-white"
            />
          </div>

          {/* Logo Text */}
          <div className="min-w-0">
            <h1 className="text-sm xs:text-base sm:text-xl md:text-2xl font-bold tracking-wide text-[#0B2E33] truncate">
              StockTracker
            </h1>

            <p
              className="
                text-[10px] xs:text-xs sm:text-sm
                text-[#f77f00] font-medium
                truncate
              "
            >
              Portfolio & Market Insights
            </p>

          </div>

        </div>

        {/* Desktop NavLinks */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-20 text-[20px] font-semibold">

          <li>
            <Link
              href="/dashboard"
              className="text-[#0B2E33] hover:text-[#f77f00] transition-all duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#f77f00] hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/watchList"
              className="text-[#0B2E33] hover:text-[#f77f00] transition-all duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#f77f00] hover:after:w-full after:transition-all after:duration-300"
            >
              WatchList
            </Link>
          </li>

          <li>
            <Link
              href="/holdings"
              className="text-[#0B2E33] hover:text-[#f77f00] transition-all duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#f77f00] hover:after:w-full after:transition-all after:duration-300"
            >
              Holdings
            </Link>
          </li>

        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

          {/* Notification Icon */}
          <Link
            href="/alerts"
            className="relative bg-[#003049] p-2 sm:p-2.5 md:p-3 rounded-full shadow-md cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <IoNotificationsOutline className="text-white text-lg sm:text-xl" />

            {/* Notification Dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#f77f00] rounded-full"></span>
          </Link>

          {/* User Initials */}
          <div className="relative" ref={dropdownRef}>

            <div
              onClick={() => setShowLogout(!showLogout)}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#003049] border border-[#f77f0030] flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 flex-shrink-0"
            >

              <p className="text-white text-xs sm:text-sm font-bold tracking-wide">
                {initials}
              </p>

            </div>

            {showLogout && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{user?.id}</p>
                </div>

                <button
                  onClick={() => {
                    setShowLogout(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all flex items-center gap-3"
                >
                  <IoLogOutOutline className="text-lg" />
                  Logout
                </button>

              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-[#003049] p-2 rounded-xl text-white shadow-md hover:scale-105 transition-all duration-300"
          >
            {menuOpen ? (
              <HiX className="text-2xl" />
            ) : (
              <HiMenuAlt3 className="text-2xl" />
            )}
          </button>

        </div>

      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e5e7eb] shadow-lg">

          <ul className="flex flex-col px-6 py-5 gap-5 text-[15px] font-semibold">

            <li>
              <Link
                href="/dashboard"
                className="text-[#0B2E33] hover:text-[#f77f00] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/watchList"
                className="text-[#0B2E33] hover:text-[#f77f00] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                WatchList
              </Link>
            </li>

            <li>
              <Link
                href="/holdings"
                className="text-[#0B2E33] hover:text-[#f77f00] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Holdings
              </Link>
            </li>

          </ul>

        </div>
      )}

    </header>
  );
};

export default Header;