'use client';

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="w-full bg-[#003049] text-white mt-16">

      {/* Top Section */}
      <div className="w-full px-5 sm:px-8 lg:px-12 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

          {/* Brand Section */}
          <div>

            <h1 className="text-3xl font-bold tracking-wide text-white font-[Poppins]">
              StockTracker
            </h1>

            <p className="text-[#f77f00] mt-1 text-sm sm:text-base">
              Portfolio & Market Insights
            </p>

            <p className="text-gray-300 mt-5 leading-7 text-sm sm:text-base">
              Track your investments, monitor stock market updates,
              manage watchlists, and analyze portfolio performance
              with a modern dashboard experience.
            </p>

          </div>

          {/* Quick Links */}
          <div className="md:ml-18">

            <h2 className="text-xl font-semibold mb-5 text-white">
              Quick Links
            </h2>

            <ul className="flex flex-col gap-4 text-gray-300">

              <li>
                <Link
                  href="/"
                  className="hover:text-[#f77f00] transition-all duration-300"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-[#f77f00] transition-all duration-300"
                >
                  WatchList
                </Link>
              </li>

              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-[#f77f00] transition-all duration-300"
                >
                  Holdings
                </Link>
              </li>
               <li>
                <Link
                  href="/portfolio"
                  className="hover:text-[#f77f00] transition-all duration-300"
                >
                  Alerts
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact / Social */}
          <div>

            <h2 className="text-xl font-semibold mb-5 text-white">
              Connect With Us
            </h2>

            <div className="flex items-center gap-4 mb-5">

              <a
                href="#"
                className="bg-white/10 p-3 rounded-full hover:bg-[#f77f00] transition-all duration-300"
              >
                <FaGithub className="text-xl" />
              </a>

              <a
                href="#"
                className="bg-white/10 p-3 rounded-full hover:bg-[#f77f00] transition-all duration-300"
              >
                <FaLinkedin className="text-xl" />
              </a>

              <a
                href="#"
                className="bg-white/10 p-3 rounded-full hover:bg-[#f77f00] transition-all duration-300"
              >
                <FaTwitter className="text-xl" />
              </a>

            </div>

            <div className="flex items-center gap-3 text-gray-300">

              <MdEmail className="text-xl text-[#f77f00]" />

              <p className="text-sm sm:text-base">
                support@stocktracker.com
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 py-5 px-5 sm:px-8 lg:px-12">

        <div className="flex items-center justify-center">

          <p className="text-sm text-gray-300 text-center">
            © 2026 StockTracker. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;