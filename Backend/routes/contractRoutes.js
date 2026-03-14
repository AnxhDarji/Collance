import express from "express";
import { acceptProposal, rejectProposal, getMyContracts } from "../controllers/contractController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/accept", auth, acceptProposal);
router.post("/reject", auth, rejectProposal);
router.get("/my-contracts", auth, getMyContracts);

export default router;