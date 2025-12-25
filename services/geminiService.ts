
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const analyzeGesture = async (imageBase64: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
        { text: "Analyze the hand gesture in this image. Is it a 'Closed Fist', 'Open Palm', 'Peace Sign', 'Thumbs Up', or 'Point'? Return ONLY a JSON object with 'gesture', 'confidence' (0-1), and 'command' (what it might trigger)." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          gesture: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          command: { type: Type.STRING }
        },
        required: ["gesture", "confidence", "command"]
      }
    }
  });
  
  return JSON.parse(response.text || "{}");
};

export const getSystemInsight = async (prompt: string) => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "You are the onboard AI for the GloveStream Pro Smart Gesture Control Glove. You provide technical insights about haptic feedback, sensor fusion, and gesture recognition. Keep responses concise and futuristic."
        }
    });
    return response.text;
};
