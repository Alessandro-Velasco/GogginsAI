import Navbar from "@/components/ui/Navbar";
import { UserThread } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";



export default function AppLayout({ children }: { children: React.ReactNode }) {

  const  [userThread, setUserThread] = useState<UserThread | null>(null);
  useEffect(() => 
    {
  async function getUserThread() {
    const response = await axios.get<{
      success: boolean;
      message?: string;
      userThread: UserThread;
    }>("/api/user-thread")
  }

  if (!Response.data.success || !Response.data.userThread) {
    console.error(Response.data.message ?? "Unknow error.");
    setUserThread(null)
    return;
  }

  setUserThread(Response.data.userThread);

  getUserThread();
  
   
  }, []);
  
    return (
   <div className="flex flex-col w-full h-full">
    <Navbar />
    {children}
   </div>
    );
  }