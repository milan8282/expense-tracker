import express from "express";
import {
  getMonthlyStats,
  getCategoryStats,
  getPaymentMethodStats,
  getDashboardStats,
} from "../controllers/stats.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/monthly", getMonthlyStats);
router.get("/category", getCategoryStats);
router.get("/payment-method", getPaymentMethodStats);

export default router;