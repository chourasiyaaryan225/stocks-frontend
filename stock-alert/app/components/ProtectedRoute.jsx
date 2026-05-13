"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return <Loading message="Checking authentication..." />;
  }

  return children;
}