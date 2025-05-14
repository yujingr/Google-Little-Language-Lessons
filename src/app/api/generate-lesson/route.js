import { NextResponse } from "next/server";
import OpenAI from "openai";
import { lessonSchema, prompt } from "@/app/tiny-lesson/api";

export async function POST(req) {
  try {
    // Parse request body
    const { language, topic } = await req.json();

    if (!language || !topic) {
      return NextResponse.json(
        { error: "Language and topic are required" },
        { status: 400 }
      );
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_BASE_URL,
    });

    // Construct the user prompt
    const userPrompt = `Create a language learning resource for ${language} on the topic of ${topic}.`;

    // Call the OpenAI API directly
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the response JSON
    const generatedText = response.choices[0].message.content;
    const generatedData = JSON.parse(generatedText);

    // Validate the data against our schema
    const validationResult = lessonSchema.safeParse(generatedData);
    if (!validationResult.success) {
      console.error("Schema validation failed:", validationResult.error);

      // Return what we have anyway, but log the error
      return NextResponse.json(generatedData);
    }

    return NextResponse.json(validationResult.data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson data", message: error.message },
      { status: 500 }
    );
  }
}
