"use client";



import { Message } from 'openai/resources/beta/threads/messages.mjs';
import React, { useState } from 'react';

function ChatPage() {
  const [fetching, setFetching] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    
  }
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