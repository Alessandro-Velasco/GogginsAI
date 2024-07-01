import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    const {threadId} = await req.json();

    if(!threadId) {
        return NextResponse.json(
            { error: "threadId is required", succcess: false },
            { status: 400 }
        );
    }

    const openai = new OpenAI();

 try {
    const messages = await openai.beta.threads.messages.list(threadId);

    console.log("from openai messages", messages);
    return NextResponse.json({ messages, success: true }, { status: 200 });
 } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong", success: false }, { status: 500 })
    
 }
}