import express from "express";
import { acceptProposal, rejectProposal, getMyContracts } from "../controllers/contractController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/accept", verifyToken, acceptProposal);
router.post("/reject", verifyToken, rejectProposal);
router.get("/my-contracts", verifyToken, getMyContracts);

export default router;