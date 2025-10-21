// server/util/giminiClient.js
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

// client จะดึง API key จาก process.env.GEMINI_API_KEY อัตโนมัติ
const ai = new GoogleGenAI({})

export const askGemini = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",  // หรือ "gemini-1.5-flash" ตามต้องการ
    contents: prompt,
  })

  return response.text || "No response"
}
