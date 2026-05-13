"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from '@/app/components/form';
import useLocalStorage from './hooks/useLocalStorage';

export default function Home() {
  const { user } = useLocalStorage();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user && user.id) {
      router.push('/dashboard');
      return;
    }

    // Clear any existing data when on login page
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, [user, router]);

  return (
    <div>
      <Form/>
    </div>
  );
}