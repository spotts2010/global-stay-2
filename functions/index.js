// index.js

// Load environment variables from .env in local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

admin.initializeApp();

// Get API key from either .env (local) or Firebase Functions config (production)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key; // fixed key name

if (!GEMINI_API_KEY) {
  throw new Error('❌ Missing Gemini API key. Set it in .env or Firebase config.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const db = admin.firestore();

exports.getFullGeminiResponse = functions.https.onRequest(async (req, res) => {
  // Trigger redeploy to pick up new config
  try {
    const { prompt, sessionId } = req.body;

    if (!prompt || !sessionId) {
      return res.status(400).send({ error: 'Missing prompt or sessionId' });
    }

    // Load previous history for this session
    const sessionRef = db.collection('chatSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();
    const history = sessionSnap.exists ? sessionSnap.data().history : [];

    // Start chat session with history
    const chat = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }).startChat({
      history,
    });

    // Send the new user message
    const result = await chat.sendMessage(prompt);
    const reply = result.response.text();

    // Update Firestore history
    const newHistory = [
      ...history,
      { role: 'user', parts: [{ text: prompt }] },
      { role: 'model', parts: [{ text: reply }] },
    ];
    await sessionRef.set({ history: newHistory });

    res.status(200).send({ response: reply });
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    res.status(500).send({ error: error.message });
  }
});
