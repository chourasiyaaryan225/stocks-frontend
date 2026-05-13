"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import AlertsList from "../components/AlertsList";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <Header />
      <AlertsList />
      <Footer />
    </ProtectedRoute>
  );
}
