
import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data url prefix: "data:*/*;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * NOTE: This is a conceptual implementation.
 * The standard Gemini API `generateContent` does not officially support direct audio file inputs
 * in the same way it supports images. This function constructs a request based on how such a
 * feature might work, using a multimodal model. In a real-world scenario, you would typically
 * use a dedicated Speech-to-Text API.
 */
export const transcribeAudio = async (audioFile: File): Promise<string> => {
  const base64Audio = await fileToBase64(audioFile);

  const audioPart = {
    inlineData: {
      mimeType: audioFile.type,
      data: base64Audio,
    },
  };
  
  const textPart = {
    text: "You are an expert audio transcription service. Please transcribe the provided audio content accurately. Identify the language and transcribe it in that language.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [textPart, audioPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw new Error("The AI model could not process the audio file. It may be an unsupported format or too large.");
  }
};

export const translateToGerman = async (text: string): Promise<string> => {
  if (!text) {
    return "";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Translate the following text into German. Maintain the original meaning and context. Do not add any commentary, just provide the translation.\n\nTEXT:\n"""\n${text}\n"""\n\nGERMAN TRANSLATION:`,
    });
    return response.text;
  } catch (error) {
    console.error("Error during translation:", error);
    throw new Error("The AI model failed to translate the text.");
  }
};
