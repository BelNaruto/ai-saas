
import {auth} from "@clerk/nextjs"
import {Configuration, OpenAIApi} from 'openai';
import { NextResponse } from 'next/server';



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    // Other optional configuration options can be provided here
  });


const openai= new OpenAIApi(configuration);

export async function POST(
    req: Request
){
    try {
        const {userId}=auth();
        const body= await req.json();
        const {messages}=body;

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!configuration.apiKey){
            return new NextResponse("OpenAI API key not configured", {status: 500});
        }

        if(!messages){
            return new NextResponse("Messages are required", {status: 400});
        }

        // Using the model
        const response=await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages
        });

        return NextResponse.json(response.data.choices[0].message);

        
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("internal Error", {status: 500});
        
    }

}


