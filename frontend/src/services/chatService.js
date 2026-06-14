import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google SDK. Ensure your .env is loaded.
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for UI testing if API key is missing
    return "I am a fallback response. Check your API key or backend connection.";
  }
};