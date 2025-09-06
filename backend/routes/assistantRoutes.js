import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

dotenv.config();
const router = express.Router();

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// MongoDB Schema for chat history
const chatSchema = new mongoose.Schema({
  userId: String,
  history: Array, // [{role:"user", parts:[{text:"..."}]}, ...]
  lastActive: { type: Date, default: Date.now }, // track last activity
});
const Chat = mongoose.model("Chat", chatSchema);

// --- Default context / system prompt ---
const defaultHistory = [
  {
    role: "user",
    parts: [
      {
        text: `
You are Nirmaan Hetu's friendly, non-robotic home assistant.  
Help with everything about homes — paint choices, décor, ceiling, lighting, furniture, and more.  

Rules:  
1. Always ask for missing details before giving suggestions. 
2. Keep replies short: usually 2 lines max, casual and friendly. 
3. Share advice step by step, not all at once. 
4. Sound like a real person, not a robot.
5. If unsure, politely say so instead of making things up. 
6. For important queries, reply in 4–5 warm, helpful lines.

Tips:  
- For paint: suggest 2–3 combos (Asian Paints vs Berger).  
- For décor: share quick modern ideas, affordable ideas. 
- For ceilings: suggest fall ceiling or POP options.  
- Always rephrase to sound like real conversation.  
        `,
      },
    ],
  },
];

// --- POST /assistant ---
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    let chatDoc = await Chat.findOne({ userId });
    if (!chatDoc) {
      chatDoc = new Chat({ userId, history: [] });
      await chatDoc.save();

      return res.json({
        reply: "Hi! I'm Nirmaan 👋 What home idea can I help with first?",
      });
    }

    // Add user message
    chatDoc.history.push({ role: "user", parts: [{ text: message }] });
    chatDoc.lastActive = Date.now();

    // Keep last 30
    if (chatDoc.history.length > 30) {
      chatDoc.history = chatDoc.history.slice(-30);
    }

    // Always prepend system instructions
    const systemHistory = [
      {
        role: "user",
        parts: [{ text: defaultHistory[0].parts[0].text }],
      },
    ];

    // Start chat with system + real conversation
    const chat = model.startChat({ history: [...systemHistory, ...chatDoc.history] });
    let reply;
    try {
      const result = await chat.sendMessage(message);
      reply = result.response.text();
    } catch (aiErr) {
      console.error("Gemini API error:", aiErr.message);
      reply =
        "Sorry, I couldn’t process that right now. Could you try asking in a simpler way?";
    }

    // Save assistant reply
    chatDoc.history.push({ role: "model", parts: [{ text: reply }] });

    // Trim
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



// --- Reset session ---
router.post("/reset", async (req, res) => {
  try {
    const { userId } = req.body;
    await Chat.findOneAndUpdate(
      { userId },
      { history: [...defaultHistory], lastActive: Date.now() },
      { upsert: true }
    );
    res.json({ message: "Chat history reset. Let's start fresh!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset chat session" });
  }
});

export default router;
