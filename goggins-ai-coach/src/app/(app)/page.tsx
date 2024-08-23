"use client";

import axios from 'axios';

import { useAtom } from 'jotai';
import { Message, Run } from 'openai/resources/beta/threads/index.mjs';
import React, { useCallback, useEffect, useState } from 'react';
import { assistantAtom, userThreadAtom } from '../../../atoms';
import toast from 'react-hot-toast';

const POLLING_FREQUENCY_MS = 1000;

function ChatPage() {

  const [userThread] = useAtom(userThreadAtom);
  const [assistant] = useAtom(assistantAtom);
  
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false)

  console.log("message", message);

  console.log("messages", messages);
  console.log("userThread", userThread);

  const fetchMessages = useCallback(async () => {

      if (!userThread) return;
  
      setFetching(true);
      
  
      try {
        
        const response = await axios.post<{
          success: boolean;
          error?: string;
          messages?: Message[];
        }>("/api/message/list", { threadId: userThread.threadId });
    
    
        if (!response.data.success || !response.data.messages) {
          console.error(response.data.error ?? "Unknow error.");
        
          return;
        }
    
         let newMessages = response.data.messages;

         console.log("newMessages", newMessages);
         
         newMessages = newMessages
         .sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
         })
         .filter((message) => 
          message.content[0].type === "text" &&
          message.content[0].text.value.trim() !== ""
         );
    
         setMessages(newMessages);
      } catch (error) {
        console.error(error);
        setMessages([]);
      } finally {
        setFetching(false);
      }
  
      
  
   }, [userThread]);

    useEffect(() => {
      const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);

      return () => clearInterval(intervalId);
    }, [fetchMessages]);

    const startRun = async (
      threadId: string, 
      assistantId: string
    ): Promise<string> => {

      try {
        const {data: { success, run, error }} = await axios.post<{
          success: boolean;
          error?: string;
          run: Run; 
        }>("api/run/create", {
          threadId,
          assistantId,
        });

        if(!success || !run) {
          console.error(error);
          toast.error("Failed to start run.");
          return "";
        }

        return run.id;
      } catch (error) {
        console.error(error);
        toast.error("Faild to start run.");
        return "";
      }
     
    }

    const pollRunStatus = async (threadId: string, runId: string) => {

    }

    const sendMessage = async () => {
      if (!userThread || sending || !assistant) {
        toast.error("Failed to send message. Invalid state.");
        return;
      }

      setSending(true);
      
try {
  const { data: {message: newMessages}} = await axios.post<{
    success: boolean; 
    message?: Message;
    error?: string;
  }>("/api/message/create", {
    message,
    threadId: userThread.threadId,
    fromUser: 'true',
  });

  if(!newMessages) {

    console.error("No message returned.");
    toast.error("Failed to send message. Please try again.");
    return;
  }


  setMessages((prev) => [...prev, newMessages]);
  setMessage("");
  toast.success("Message sent.");
  const runId = await startRun(userThread.threadId, assistant.assistantId);
  pollRunStatus(userThread.threadId, runId);

} catch (error) {
  console.error(error)
  toast.error("Failed to send message. Please try again.")
}
      
    };

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex flex-col bg-black text-white">

    <div className='flex-grow overflow-hidden p-8 space-y-2'>

     {fetching && messages.length === 0 && (
      <div className="text-center font-bold">Fetching...</div>
      )}

     {messages.length === 0 && !fetching &&(
      <div className="text-center font-bold">No messages...</div>
     )}


    {messages.map((message) => (
    <div 
      key={message.id} 
      className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${
        ["true", "True"].includes(
        (message.metadata as { fromUser?: string }).fromUser ?? ""
      )
        ? "bg-yellow-500 ml-auto"
        : "bg-gray-700"}`}>
      {message.content[0].type === "text" 
       ? message.content[0].text.value
          .split("\n")
          .map((text, index) => <p key={index}>{text}</p>)
      : null}
        </div>

    ))}
      </div>

    <div className='mt-auto p-4 bg-gray-800'>
      <div className='flex items-center bg-white p-2'>
        <input 
         type='text'
         className='flex-grow bg-transparent text-black focus:outline-none'
         placeholder='Type a message...'
         value={message}
         onChange={(e) => setMessage(e.target.value)}
         
         />
        <button disabled={!userThread?.threadId ||!assistant || sending || !message.trim()} className='ml-4 bg-yellow-500 text-white px-4 py-2 rounded-full focus: outline-none disabled:bg-yellow-700' onClick={sendMessage}>Send</button>
      </div>
    </div>

    </div>
  );
}

export default ChatPage;