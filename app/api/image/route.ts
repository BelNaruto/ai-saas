
import {auth} from "@clerk/nextjs"
import {Configuration, OpenAIApi} from 'openai';
import { NextResponse } from 'next/server';

// Import the API Limit
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

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
        const {prompt, amount=1, resolution= "512x512"}=body;

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!configuration.apiKey){
            return new NextResponse("OpenAI API key not configured", {status: 500});
        }


        if(!prompt){
            return new NextResponse("Prompt is required", {status: 400});
        }

        if(!amount){
            return new NextResponse("Amount is required", {status: 400});
        }


        if(!resolution){
            return new NextResponse("Resolution is required", {status: 400});
        }

        const freeTrial = await checkApiLimit();

        if(!freeTrial){
            return new NextResponse("Free trial has expired.", {status: 403 })
        }

        // Using the model
        const response=await openai.createImage({
          prompt,
          n: parseInt(amount, 10),
          size:resolution,
        });

        await increaseApiLimit();

        return NextResponse.json(response.data.data);

        
    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("internal Error", {status: 500});
        
    }

}


