import express from "express";
import authRoutes from "./auth.routes.js";
import expenseRoutes from "./expense.routes.js";
import statsRoutes from "./stats.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/stats", statsRoutes);

export default router;