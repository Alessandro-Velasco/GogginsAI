"use client"
import React, { useState } from 'react';

function ChatPage() {
  const [fetching, setFetching] = useState(true);
  return (
    <div className="w-screen h-full flex flex-col bg-black text-white">ChatPage
    <div className='flex-grow overflow-hidden p-8 space-y-2'>
     {fetching && <div className="text-center font-bold">Fetching...</div>}
    
    </div>
    
    
    
    
    </div>
  )
}

export default ChatPage;