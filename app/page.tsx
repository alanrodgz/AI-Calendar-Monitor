"use client";

import { useAuth } from "@/hooks/useAuth";
import Landing from "@/components/landing";
import Calendar from "@/components/calendar";
import LoadingScreen from "@/components/loading-screen";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loading) {
    return <LoadingScreen />;
  }

  return user ? <Calendar /> : <Landing />;
}