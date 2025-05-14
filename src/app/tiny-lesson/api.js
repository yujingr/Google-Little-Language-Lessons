import { generateObject } from "ai";
import { z } from "zod";
import { prompt } from "./prompt";

// Define schema for vocabulary items
const vocabularySchema = z.array(
  z.object({
    word: z.string(),
    translation: z.string(),
    pronunciation: z.string().optional(),
    partOfSpeech: z.string().optional(),
  })
);

// Define schema for phrases
const phrasesSchema = z.array(
  z.object({
    phrase: z.string(),
    translation: z.string(),
    usage: z.string().optional(),
  })
);

// Define schema for tips
const tipsSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    examples: z.array(z.string()),
  })
);

// Define schema for practice suggestions
const practiceSchema = z.array(z.string());

// Define schema for the entire lesson data
const lessonSchema = z.object({
  vocabulary: vocabularySchema,
  phrases: phrasesSchema,
  tips: tipsSchema,
  practice: practiceSchema,
});

// Client-side function to call the API
export async function generateLessonData(language, topic) {
  try {
    const response = await fetch("/api/generate-lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language, topic }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error generating lesson data:", error);
    throw error;
  }
}

// Export schema for use in API route
export { lessonSchema, prompt };
