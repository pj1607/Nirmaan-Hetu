import express from "express";
import multer from "multer";
import { verifyToken } from "../auth/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const isPdf =
      file.mimetype === "application/pdf" &&
      file.originalname?.toLowerCase().endsWith(".pdf");
    callback(isPdf ? null : new Error("Only PDF files are supported."), isPdf);
  },
});

const requireOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ detail: "Authentication required." });
  }
  if (req.user.role !== "owner") {
    return res.status(403).json({ detail: "Only Owners can use this AI assistant." });
  }
  next();
};

const getAiConfig = (res) => {
  const serviceUrl = process.env.AI_SERVICE_URL;
  const internalKey = process.env.AI_INTERNAL_API_KEY;
  if (!serviceUrl || !internalKey) {
    res.status(503).json({ detail: "AI service is not configured on the backend." });
    return null;
  }
  return { serviceUrl: serviceUrl.replace(/\/$/, ""), internalKey };
};

const forwardJson = async (res, path, body, ownerId) => {
  const config = getAiConfig(res);
  if (!config) return;

  try {
    const response = await fetch(`${config.serviceUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-AI-Key": config.internalKey,
        "X-Owner-ID": String(ownerId),
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({
      detail: "AI service returned an invalid response.",
    }));
    return res.status(response.status).json(payload);
  } catch (error) {
    console.error("AI service request failed:", error.message);
    return res.status(502).json({ detail: "Could not connect to the AI service." });
  }
};

router.post("/agent/query", verifyToken, requireOwner, async (req, res) => {
  const { question, top_k: topK = 4 } = req.body || {};
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ detail: "A question is required." });
  }
  return forwardJson(
    res,
    "/api/agent/query",
    { question: question.trim(), top_k: topK },
    req.user._id
  );
});

router.post(
  "/documents/upload",
  verifyToken,
  requireOwner,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ detail: "Please select a PDF file." });
    }

    const config = getAiConfig(res);
    if (!config) return;

    try {
      const form = new FormData();
      form.append(
        "file",
        new Blob([req.file.buffer], { type: "application/pdf" }),
        req.file.originalname
      );
      const response = await fetch(`${config.serviceUrl}/api/documents/upload`, {
        method: "POST",
        headers: {
          "X-Internal-AI-Key": config.internalKey,
          "X-Owner-ID": String(req.user._id),
        },
        body: form,
      });
      const payload = await response.json().catch(() => ({
        detail: "AI service returned an invalid response.",
      }));
      return res.status(response.status).json(payload);
    } catch (error) {
      console.error("AI document upload failed:", error.message);
      return res.status(502).json({ detail: "Could not connect to the AI service." });
    }
  }
);

router.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ detail: "PDF exceeds the 15 MB upload limit." });
  }
  if (error.message === "Only PDF files are supported.") {
    return res.status(400).json({ detail: error.message });
  }
  console.error("AI route error:", error);
  return res.status(500).json({ detail: "AI request failed." });
});

export default router;
