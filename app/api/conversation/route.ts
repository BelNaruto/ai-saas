import OpenAI from 'openai';
import { NextResponse } from 'next/server';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Other optional configuration options can be provided here
  });


export async function POST(
    req: Request
){
    try {
        
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse;
        
    }

}


