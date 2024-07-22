"use client"; 

import Navbar from "@/components/ui/Navbar";
import { UserThread } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

// Define the UserThread type based on your Prisma schema


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [userThread, setUserThread] = useState<UserThread | null>(null);

  useEffect(() => {
    async function getUserThread() {
      try {
        const response = await axios.get<{
          success: boolean;
          message?: string;
          userThread: UserThread;
        }>("/api/user-thread");

        if (!response.data.success || !response.data.userThread) {
          console.error(response.data.message ?? "Unknown error.");
          setUserThread(null);
          return;
        }

        setUserThread(response.data.userThread);
      } catch (error) {
        console.error(error);
        setUserThread(null);
      }
      
    }

    getUserThread();
  }, []);

  console.log("userThread", userThread);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
    </div>
  );
}

