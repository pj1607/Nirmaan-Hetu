import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

dotenv.config();
const router = express.Router();

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//MongoDB Schema 
const chatSchema = new mongoose.Schema({
  userId: String,
  history: Array,
  lastActive: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);


const defaultInstructions = [
  {
    role: "user", 
    parts: [
      {
        text: `
You are Nirmaan Hetu's friendly, non-robotic home assistant.
Rules:
1. Ask clarifying questions first before giving advice.
2. Give step-by-step guidance.
3. Reply in 2 lines max.
4. Always sound warm and conversational.
5. Help with everything about homes — paint combos, décor, ceilings, lighting, furniture, etc.
6. If unsure, politely say so instead of making things up.
7. Always rephrase responses to sound like a real person.
        `,
      },
    ],
  },
];

//POST /assistant
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Load or create chat history
    let chatDoc = await Chat.findOne({ userId });
    if (!chatDoc) {
      chatDoc = new Chat({ userId, history: [] });
    }

    // Add user message
    chatDoc.history.push({ role: "user", parts: [{ text: message }] });
    chatDoc.lastActive = Date.now();

    // 🔹 Limit to last 30 messages
    if (chatDoc.history.length > 30) {
      chatDoc.history = chatDoc.history.slice(-30);
    }

   
    const historyForGemini = [
      ...defaultInstructions, // always at top
      ...chatDoc.history.slice(-15), // last 15 messages
    ];

    // Start chat
    const chat = model.startChat({ history: historyForGemini });
    let reply;
    try {
      const result = await chat.sendMessage(message);
      reply = result.response.text();
    } catch (aiErr) {
      console.error("Gemini API error:", aiErr.message);
      reply = "Sorry, I couldn’t process that right now. ";
    }

    // Save assistant reply
    chatDoc.history.push({ role: "model", parts: [{ text: reply }] });

    // Trim again if needed
    if (chatDoc.history.length > 30) {
      chatDoc.history = chatDoc.history.slice(-30);
    }

    await chatDoc.save();
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini AI Assistant error" });
  }
});


router.post("/reset", async (req, res) => {
  try {
    const { userId } = req.body;
    await Chat.findOneAndUpdate(
      { userId },
      { history: [], lastActive: Date.now() },
      { upsert: true }
    );
    res.json({ message: "Chat history reset. Let's start fresh!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset chat session" });
  }
});

export default router;
