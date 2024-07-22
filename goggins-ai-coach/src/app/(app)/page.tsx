"use client";

import axios from 'axios';
import { Message } from 'openai/resources/beta/threads/messages.mjs';
import React, { useState } from 'react';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function ChatPage() {
  
  const [fetching, setFetching] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const Message = async () => {

    setFetching(true);

    const response = await axios.get<{
      success: Boolean;
      error?: string;
      messages?: Message[];
    }>("/api/messages/list");

    if (!response.data.success || !response.data.messages) {
      console.error(response.data.error ?? "Unknow error.");
      setFetching(false);
      return;
    }

     let newMessages = response.data.messages;


    };

  return (
    <div className="w-screen h-full flex flex-col bg-black text-white">ChatPage
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