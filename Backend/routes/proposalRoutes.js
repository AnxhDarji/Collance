import express from "express";
import { requestProject, getIncomingProposals } from "../controllers/proposalController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", verifyToken, requestProject);
router.get("/incoming", verifyToken, getIncomingProposals);

export default router;