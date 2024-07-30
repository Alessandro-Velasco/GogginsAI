"use client";

import axios from 'axios';
import { useAtom } from 'jotai';
import { Message } from 'openai/resources/beta/threads/messages.mjs';
import React, { useCallback, useEffect, useState } from 'react';
import { userThreadAtom } from '../../../atoms';

const POLLING_FREQUENCY_MS = 1000;

function ChatPage() {

  const [userThread] = useAtom(userThreadAtom);
  
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  console.log("messages", messages);
  console.log("userThread", userThread)

  const fetchMessages = useCallback(async () => {

      if (!userThread) return;
  
      setFetching(true);
  
      try {
        const response = await axios.post<{
          success: boolean;
          error?: string;
          messages?: Message[];
        }>("/api/messages/list", { threadId: userThread.threadId });
    
    
        if (!response.data.success || !response.data.messages) {
          console.error(response.data.error ?? "Unknow error.");
        
          return;
        }
    
         let newMessages = response.data.messages;

         console.log("newMessages", newMessages);
         
         newMessages = newMessages
         .sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
         })
         .filter((message) => 
          message.content[0].type === "text" &&
          message.content[0].text.value.trim() !== ""
         );
    
         setMessages(newMessages);
      } catch (error) {
        console.error(error);
        setFetching(false);
        setMessages([]);
      } finally {
        setFetching(false);
      }
  
      
  
   }, [userThread]);

    useEffect(() => {
      const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);

      return () => clearInterval(intervalId);
    }, [])

  return (
    <div className="w-screen h-full flex flex-col bg-black text-white">

    <div className='flex-grow overflow-hidden p-8 space-y-2'>

     {fetching && messages.length === 0 && (
      <div className="text-center font-bold">Fetching...</div>
      )}

     {messages.length === 0 && !fetching &&(
      <div className="text-center font-bold">No messages...</div>
     )}


    {messages.map((message) => (
    <div 
      key={message.id} className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${["true", "True"].includes(
        (message.metadata  as { fromUser?: string }).fromUser ?? ""
      )
        ? "bg-yellow-500 ml-auto"
        : "bg-gray-700"}`}>
      {message.content[0].type === "text" 
       ? message.content[0].text.value
          .split("\n")
          .map((text, index) => (<p key={index}>{text}</p>))
      : null}
        </div>

    ))}
      </div>

    </div>
  );
}

export default ChatPage;