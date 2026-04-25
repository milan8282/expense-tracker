import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  bulkDeleteExpenses,
  bulkUploadExpenses,
  getCategorySuggestions,
  exportExpensesCsv,
} from "../controllers/expense.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadCsv } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/categories/suggestions", getCategorySuggestions);
router.get("/export/csv", exportExpensesCsv);

router.route("/").post(createExpense).get(getExpenses);

router.post("/bulk-delete", bulkDeleteExpenses);
router.post("/bulk-upload", uploadCsv.single("file"), bulkUploadExpenses);

router.route("/:id").get(getExpenseById).patch(updateExpense).delete(deleteExpense);

export default router;


/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get expenses with filters, sorting and pagination
 *     tags: [Expenses]
 *     security:
 *       - cookieAuth: []
 */

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - cookieAuth: []
 */

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Update expense partially
 *     tags: [Expenses]
 *     security:
 *       - cookieAuth: []
 */

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     tags: [Expenses]
 *     security:
 *       - cookieAuth: []
 */

/**
 * @swagger
 * /expenses/bulk-upload:
 *   post:
 *     summary: Upload expenses using CSV
 *     tags: [Expenses]
 *     security:
 *       - cookieAuth: []
 */

/**
 * @swagger
 * /expenses/bulk-delete:
 *   post:
 *     summary: Bulk delete expenses
 *     tags: [Expenses]
 *     security:
 *       - cookieAuth: []
 */

/**
 * @swagger
 * /expenses/export/csv:
 *   get:
 *     summary: Export expenses as CSV
 *     tags: [Expenses]
 *     security:
 *       - cookieAuth: []
 */