import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getFullGeminiResponse = functions.https.onRequest(async (req, res) => {
  try {
    const userPrompt = req.body.prompt || "Explain quantum computing simply.";

    // SYSTEM & USER INSTRUCTIONS
    const systemInstruction = `
      You are a helpful AI that always provides a COMPLETE and CLEAR response.
      Do not stop mid-sentence or mid-code.
      If you provide code, always finish it and close all formatting.
      Avoid using triple backticks (\`\`\`) unless specifically asked; if you do, always close them.
      If the answer is long, break it into sections and continue until all sections are done.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 2048, // Adjust higher if you need long responses
        temperature: 0.7,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ],
    });

    // Generate response
    const result = await model.generateContent({
      contents: [
        { role: "system", parts: [{ text: systemInstruction }] },
        { role: "user", parts: [{ text: userPrompt }] }
      ]
    });

    // Get text safely
    let output = result.response?.text() || "";

    // SAFEGUARD: If output ends abruptly, ask Gemini to continue
    if (!output.trim().endsWith(".") && !output.trim().endsWith("```")) {
      const contResult = await model.generateContent({
        contents: [
          { role: "system", parts: [{ text: "Continue exactly where you left off in the last answer." }] }
        ]
      });
      output += "\n" + (contResult.response?.text() || "");
    }

    res.json({ output });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
});
