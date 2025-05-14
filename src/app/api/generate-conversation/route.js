import { NextResponse } from "next/server";
import OpenAI from "openai";
import { conversationSchema, prompt } from "@/app/slang-hang/api";

export async function POST(req) {
  try {
    // Parse request body
    const { language } = await req.json();

    if (!language) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_BASE_URL,
    });

    // Construct the user prompt
    const userPrompt = `Create a complete, natural conversation with slang and idioms between two native speakers of ${language}. Generate a random, interesting setting for this conversation. The conversation should be longer (10-15 exchanges) with a natural beginning, middle, and conclusion.`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // Slightly higher temperature for more creative settings
    });

    // Parse the response JSON
    const generatedText = response.choices[0].message.content;
    const generatedData = JSON.parse(generatedText);

    // Validate the data against our schema
    const validationResult = conversationSchema.safeParse(generatedData);
    if (!validationResult.success) {
      console.error("Schema validation failed:", validationResult.error);

      // Return what we have anyway, but log the error
      return NextResponse.json(generatedData);
    }

    return NextResponse.json(validationResult.data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to generate conversation data", message: error.message },
      { status: 500 }
    );
  }
}
