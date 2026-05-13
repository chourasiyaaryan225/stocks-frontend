"use client";

import Header from '../components/header'
import StocksContainer from '../components/stocksContainer';
import Footer from "../components/footer"
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8fafc]">
        <Header/>
        <StocksContainer/>
        <Footer/>
      </div>
    </ProtectedRoute>
  );
}