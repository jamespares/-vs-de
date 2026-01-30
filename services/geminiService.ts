import { GoogleGenAI, Type } from "@google/genai";
import { FlashcardData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFlashcards = async (count: number = 5): Promise<FlashcardData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} distinct French flashcards for verbs that take either the preposition "à" or "de" before an infinitive. 
      Do not include the preposition in the sentence; replace it with "___". 
      Ensure a mix of common and intermediate verbs.
      The output must be a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              verb: { type: Type.STRING, description: "The french verb in its infinitive form (e.g. 'Aider')" },
              sentenceFrench: { type: Type.STRING, description: "A sentence using the verb with the preposition missing, marked by '___'." },
              correctPreposition: { type: Type.STRING, enum: ["à", "de"], description: "The correct preposition." },
              translationEnglish: { type: Type.STRING, description: "English translation of the full sentence." },
              explanation: { type: Type.STRING, description: "A brief grammatical explanation of why this preposition is used." },
            },
            required: ["verb", "sentenceFrench", "correctPreposition", "translationEnglish", "explanation"],
          },
        },
      },
    });

    const rawData = response.text;
    if (!rawData) {
        throw new Error("No data returned from Gemini");
    }

    const parsed = JSON.parse(rawData);
    
    // Add unique IDs
    return parsed.map((item: any, index: number) => ({
      ...item,
      id: `gen-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Failed to generate flashcards:", error);
    return [];
  }
};
