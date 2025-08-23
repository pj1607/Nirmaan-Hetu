import express from "express";
import { addPortfolio, getPortfolio, updatePortfolio, addPastWork ,deletePastWork,deletePortfolioLogo } from "../controllers/builderControllers.js";
import { verifyToken } from '../auth/auth.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store files in memory for Cloudinary upload

// Portfolio routes
router.post("/add-portfolio", verifyToken, upload.single("logo"), addPortfolio);
router.get("/get-portfolio", verifyToken, getPortfolio);
router.put("/update-portfolio", verifyToken, upload.single("logo"), updatePortfolio);
router.delete("/delete-pastwork/:id", verifyToken, deletePastWork);
router.delete("/delete-logo", verifyToken, deletePortfolioLogo);

// Add past work route
router.post("/add-pastwork", verifyToken, upload.array("images"), addPastWork);

export default router;
