"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Portfolio from "../components/Portfolio";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Holdings() {
  return (
    <ProtectedRoute>
      <Header />
      <Portfolio />
      <Footer />
    </ProtectedRoute>
  );
}
