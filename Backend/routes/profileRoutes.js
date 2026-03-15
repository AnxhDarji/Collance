import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/profile
router.get("/", verifyToken, getProfile);

// PUT /api/profile/update
router.put("/update", verifyToken, updateProfile);

export default router;

