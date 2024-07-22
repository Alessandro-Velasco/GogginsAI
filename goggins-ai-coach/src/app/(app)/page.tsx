"use client";

import axios from 'axios';
import { useAtom } from 'jotai';
import { Message } from 'openai/resources/beta/threads/messages.mjs';
import React, { useEffect, useState } from 'react';
import { userThreadAtom } from '../../../atoms';

const POLLING_FREQUENCY_MS = 1000;

function ChatPage() {

  const [userThread] = useAtom(userThreadAtom);
  
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  console.log("messages");
  console.log("userThread")

  const fetchMessages = async () => {

    if (!userThread) return;

    setFetching(true);

    try {
      const response = await axios.post<{
        success: boolean;
        error?: string;
        messages?: Message[];
      }>("/api/messages/list", { threadId });
  
  
      if (!response.data.success || !response.data.messages) {
        console.error(response.data.error ?? "Unknow error.");
        setFetching(false);
        return;
      }
  
       let newMessages = response.data.messages;
       
       newMessages = newMessages.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
       }).filter(message => 
        message.content[0].type === "text" &&
        message.content[0].text.value.trim() !== ""
       );
  
       setMessages(newMessages);
    } catch (error) {
      console.error(error);
      setFetching(false);
      setMessages([]);
    }

    

    };

    useEffect(() => {
      const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);

      return () => clearInterval(intervalId);
    }, [])

  return (
    <div className="w-screen h-full flex flex-col bg-black text-white">

    <div className='flex-grow overflow-hidden p-8 space-y-2'>

     {fetching && <div className="text-center font-bold">Fetching...</div>}

     {messages.length === 0 && !fetching &&(
      <div className="text-center font-bold">No messages...</div>


      )}

    
      </div>
    </div>
  );
}

export default ChatPage;