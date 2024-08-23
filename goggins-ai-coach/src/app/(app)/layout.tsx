"use client"; 

import Navbar from "@/components/ui/Navbar";
import { Assistant, UserThread } from "@prisma/client";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { assistantAtom, userThreadAtom } from "../../../atoms";
import toast from "react-hot-toast";

// Define the UserThread type based on your Prisma schema


export default function AppLayout({ children }: { children: React.ReactNode }) {
  //const [userThread, setUserThread] = useState<UserThread | null>(null);

 const [ , setUserThread ] = useAtom(userThreadAtom);
 const [,setAssistant] = useAtom(assistantAtom); 

 useEffect(() => {
  async function getAssistant() {
    try {
      const response = await axios.get<{
        success: boolean;
        message?: string;
        assistant: Assistant;
      }>("/api/assistant");

      if (!response.data.success || !response.data.assistant) {
        console.error(response.data.message ?? "Unknown error.");
        setAssistant(null);
        return;
      }

      setAssistant(response.data.assistant);
    } catch (error) {
      console.error(error);
      setAssistant(null);
    }
    
  }

  getAssistant();
 },[]);

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
  }, [setUserThread]);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
    </div>
  );
}

