import { z } from "zod";
import { prompt } from "./prompt";

// Define schema for message in a conversation
const messageSchema = z.object({
  speaker: z.string(),
  text: z.string(),
  translation: z.string().optional(),
  transliteration: z.string().optional(),
  explanation: z
    .array(
      z.object({
        term: z.string(),
        definition: z.string(),
        example: z.string().optional(),
      })
    )
    .optional(),
});

// Define schema for the conversation context
const conversationContextSchema = z.object({
  setting: z.string(),
  relationship: z.string(),
  speakers: z.array(
    z.object({
      name: z.string(),
      background: z.string(),
      personality: z.string().optional(),
    })
  ),
});

// Define schema for the entire conversation data
const conversationSchema = z.object({
  context: conversationContextSchema,
  messages: z.array(messageSchema),
  slangTerms: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
      example: z.string().optional(),
      origin: z.string().optional(),
    })
  ),
});

// Client-side function to call the API
export async function generateConversationData(language) {
  try {
    const response = await fetch("/api/generate-conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error generating conversation data:", error);
    throw error;
  }
}

// Export schema for use in API route
export { conversationSchema, prompt };
