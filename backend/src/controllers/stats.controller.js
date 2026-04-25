import Expense from "../models/Expense.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildStatsMatch = (req) => {
  const { category, paymentMethod, startDate, endDate } = req.query;
  const match = {};

  if (req.user.role !== "admin") {
    match.user = req.user._id;
  }

  if (category) match.category = { $regex: `^${category}$`, $options: "i" };
  if (paymentMethod) match.paymentMethod = paymentMethod;

  if (startDate || endDate) {
    match.date = {};

    if (startDate) {
      const start = new Date(startDate);
      if (Number.isNaN(start.getTime())) throw new ApiError(400, "Invalid start date");
      match.date.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (Number.isNaN(end.getTime())) throw new ApiError(400, "Invalid end date");
      end.setHours(23, 59, 59, 999);
      match.date.$lte = end;
    }
  }

  return match;
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  const match = buildStatsMatch(req);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [overall, thisMonth, topCategory, latestExpenses] = await Promise.all([
    Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
          averageExpense: { $avg: "$amount" },
        },
      },
    ]),
    Expense.aggregate([
      { $match: { ...match, date: { ...(match.date || {}), $gte: monthStart } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),
    Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]),
    Expense.find(match).sort({ date: -1 }).limit(5),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalExpense: overall[0]?.totalExpense || 0,
      totalTransactions: overall[0]?.totalTransactions || 0,
      averageExpense: Math.round(overall[0]?.averageExpense || 0),
      thisMonthExpense: thisMonth[0]?.total || 0,
      thisMonthTransactions: thisMonth[0]?.count || 0,
      topCategory: topCategory[0]?._id || "N/A",
      topCategoryAmount: topCategory[0]?.total || 0,
      latestExpenses,
    },
  });
});

export const getMonthlyStats = asyncHandler(async (req, res) => {
  const match = buildStatsMatch(req);

  const stats = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        label: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" },
              ],
            },
          ],
        },
        total: 1,
        count: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  res.status(200).json({ success: true, stats });
});

export const getCategoryStats = asyncHandler(async (req, res) => {
  const match = buildStatsMatch(req);

  const stats = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  res.status(200).json({ success: true, stats });
});

export const getPaymentMethodStats = asyncHandler(async (req, res) => {
  const match = buildStatsMatch(req);

  const stats = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$paymentMethod",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        paymentMethod: "$_id",
        total: 1,
        count: 1,
      },
    },
  ]);

  res.status(200).json({ success: true, stats });
});