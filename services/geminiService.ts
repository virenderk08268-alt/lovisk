
import { GoogleGenAI, Modality } from "@google/genai";
import { getSystemInstruction } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const chatWithGemiPal = async (message: string, langName: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: getSystemInstruction(langName),
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const generateMagicArt = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A child-friendly, colorful, high-quality illustration of: ${prompt}. Cartoon style, happy vibes.` }],
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const connectVoiceSession = async (callbacks: any, langName: string, voiceName: string = 'Kore') => {
  const ai = getAI();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      },
      systemInstruction: getSystemInstruction(langName),
    },
  });
};
