import express from "express";
import { requestProject, getIncomingProposals } from "../controllers/proposalController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", auth, requestProject);
router.get("/incoming", auth, getIncomingProposals);

export default router;