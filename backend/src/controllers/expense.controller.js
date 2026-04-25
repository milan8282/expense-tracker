import fs from "fs";
import csv from "csv-parser";
import Expense from "../models/Expense.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

const allowedSortFields = ["amount", "date", "category", "createdAt"];

const normalizePaymentMethod = (value) => {
  const method = String(value || "").toLowerCase().trim();

  if (!["cash", "credit"].includes(method)) {
    return null;
  }

  return method;
};

const buildExpenseQuery = (req) => {
  const { category, paymentMethod, startDate, endDate, search } = req.query;

  const query = {};

  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }

  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  if (startDate || endDate) {
    query.date = {};

    if (startDate) {
      const start = new Date(startDate);
      if (Number.isNaN(start.getTime())) {
        throw new ApiError(400, "Invalid start date");
      }
      query.date.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (Number.isNaN(end.getTime())) {
        throw new ApiError(400, "Invalid end date");
      }
      end.setHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }

  if (search) {
    query.$or = [
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  return query;
};

const validateExpensePayload = (payload, partial = false) => {
  const errors = [];

  if (!partial || payload.amount !== undefined) {
    const amount = Number(payload.amount);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      errors.push("Amount must be a number greater than 0");
    }
  }

  if (!partial || payload.description !== undefined) {
    if (!payload.description?.trim()) {
      errors.push("Description is required");
    }
  }

  if (!partial || payload.date !== undefined) {
    const date = new Date(payload.date);
    if (!payload.date || Number.isNaN(date.getTime())) {
      errors.push("Valid date is required");
    }
  }

  if (!partial || payload.category !== undefined) {
    if (!payload.category?.trim()) {
      errors.push("Category is required");
    }
  }

  if (!partial || payload.paymentMethod !== undefined) {
    if (!normalizePaymentMethod(payload.paymentMethod)) {
      errors.push("Payment method must be cash or credit");
    }
  }

  if (errors.length) {
    throw new ApiError(400, errors.join(", "));
  }
};

export const createExpense = asyncHandler(async (req, res) => {
  validateExpensePayload(req.body);

  const expense = await Expense.create({
    user: req.user._id,
    amount: Number(req.body.amount),
    description: req.body.description.trim(),
    date: new Date(req.body.date),
    category: req.body.category.trim(),
    paymentMethod: normalizePaymentMethod(req.body.paymentMethod),
  });

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    expense,
  });
});

export const getExpenses = asyncHandler(async (req, res) => {
  const query = buildExpenseQuery(req);
  const { page, limit, skip } = getPagination(req.query);

  const sortBy = allowedSortFields.includes(req.query.sortBy)
    ? req.query.sortBy
    : "date";

  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const [expenses, total] = await Promise.all([
    Expense.find(query)
      .populate("user", "name email role")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Expense.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    expenses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id).populate(
    "user",
    "name email role"
  );

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  if (
    req.user.role !== "admin" &&
    expense.user._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not allowed to access this expense");
  }

  res.status(200).json({
    success: true,
    expense,
  });
});

export const updateExpense = asyncHandler(async (req, res) => {
  validateExpensePayload(req.body, true);

  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  if (
    req.user.role !== "admin" &&
    expense.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not allowed to update this expense");
  }

  const updateData = {};

  if (req.body.amount !== undefined) updateData.amount = Number(req.body.amount);
  if (req.body.description !== undefined) {
    updateData.description = req.body.description.trim();
  }
  if (req.body.date !== undefined) updateData.date = new Date(req.body.date);
  if (req.body.category !== undefined) {
    updateData.category = req.body.category.trim();
  }
  if (req.body.paymentMethod !== undefined) {
    updateData.paymentMethod = normalizePaymentMethod(req.body.paymentMethod);
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    expense: updatedExpense,
  });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  if (
    req.user.role !== "admin" &&
    expense.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not allowed to delete this expense");
  }

  await expense.deleteOne();

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});

export const bulkDeleteExpenses = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Expense ids are required");
  }

  const query = { _id: { $in: ids } };

  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  const result = await Expense.deleteMany(query);

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} expenses deleted successfully`,
    deletedCount: result.deletedCount,
  });
});

export const bulkUploadExpenses = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "CSV file is required");
  }

  const validExpenses = [];
  const invalidRows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const amount = Number(row.amount);
          const date = new Date(row.date);
          const paymentMethod = normalizePaymentMethod(row.paymentMethod);

          if (
            !amount ||
            amount <= 0 ||
            Number.isNaN(date.getTime()) ||
            !row.description?.trim() ||
            !row.category?.trim() ||
            !paymentMethod
          ) {
            invalidRows.push(row);
            return;
          }

          validExpenses.push({
            user: req.user._id,
            amount,
            description: row.description.trim(),
            date,
            category: row.category.trim(),
            paymentMethod,
          });
        } catch {
          invalidRows.push(row);
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });

  fs.unlinkSync(req.file.path);

  if (!validExpenses.length) {
    throw new ApiError(400, "No valid expenses found in CSV");
  }

  const inserted = await Expense.insertMany(validExpenses);

  res.status(201).json({
    success: true,
    message: `${inserted.length} expenses uploaded successfully`,
    insertedCount: inserted.length,
    invalidCount: invalidRows.length,
  });
});

export const getCategorySuggestions = asyncHandler(async (req, res) => {
  const match = {};

  if (req.user.role !== "admin") {
    match.user = req.user._id;
  }

  const categories = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);

  res.status(200).json({
    success: true,
    categories: categories.map((item) => ({
      name: item._id,
      count: item.count,
      total: item.total,
    })),
  });
});

export const exportExpensesCsv = asyncHandler(async (req, res) => {
  const query = buildExpenseQuery(req);

  const expenses = await Expense.find(query).sort({ date: -1 });

  const escapeCsv = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [
    ["Amount", "Description", "Date", "Category", "Payment Method", "Created At"],
    ...expenses.map((expense) => [
      expense.amount,
      expense.description,
      new Date(expense.date).toISOString().split("T")[0],
      expense.category,
      expense.paymentMethod,
      new Date(expense.createdAt).toISOString(),
    ]),
  ];

  const csvContent = csvRows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=expenses-${Date.now()}.csv`
  );

  res.status(200).send(csvContent);
});