import { onRequest } from 'firebase-functions/v2/onRequest';
import admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Always load from .env

admin.initializeApp();
const db = admin.firestore();

export const getFullGeminiResponse = onRequest(async (req, res) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error('❌ Missing Gemini API key.');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const { prompt, sessionId } = req.body;

    if (!prompt || !sessionId) {
      return res.status(400).send({ error: 'Missing prompt or sessionId' });
    }

    const sessionRef = db.collection('chatSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();
    const history = sessionSnap.exists ? sessionSnap.data().history : [];

    const chat = genAI
      .getGenerativeModel({ model: 'googleai/gemini-1.5-pro' })
      .startChat({ history });

    const result = await chat.sendMessage(prompt);
    const reply = result.response.text();

    await sessionRef.set({
      history: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'model', parts: [{ text: reply }] },
      ],
    });

    res.status(200).send({ response: reply });
  } catch (error) {
    console.error('Error generating Gemini response:', error); // Not replacing this as it's outside /src
    res.status(500).send({ error: error.message });
  }
});
