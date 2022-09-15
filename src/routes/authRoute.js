import express from "express";
import { insertTransaction, list } from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/transactions",authMiddleware, insertTransaction)
router.get("/transactions", authMiddleware, list)

export default router