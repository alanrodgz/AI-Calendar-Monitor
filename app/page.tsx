"use client";

import { useAuth } from "@/hooks/useAuth";
import Landing from "@/components/landing";
import Calendar from "@/components/calendar";
import LoadingScreen from "@/components/loading-screen";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <Calendar /> : <Landing />;
}