import { useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, CreditCard, PieChartIcon, RefreshCcw } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import MonthlyLineChart from "../components/charts/MonthlyLineChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import {
  getCategoryStats,
  getMonthlyStats,
  getPaymentMethodStats,
} from "../api/statsApi";
import { formatCurrency } from "../utils/formatCurrency";
import { PAYMENT_METHODS } from "../utils/constants";

const initialFilters = {
  category: "",
  paymentMethod: "",
  startDate: "",
  endDate: "",
};

const Reports = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useMemo(
    () => ({
      category: filters.category || undefined,
      paymentMethod: filters.paymentMethod || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    }),
    [filters]
  );

  const totalFilteredExpense = categoryStats.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const totalTransactions = categoryStats.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  const topCategory = categoryStats[0]?.category || "N/A";

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [monthlyRes, categoryRes, paymentRes] = await Promise.all([
        getMonthlyStats(params),
        getCategoryStats(params),
        getPaymentMethodStats(params),
      ]);

      setMonthlyStats(monthlyRes.data.stats || []);
      setCategoryStats(categoryRes.data.stats || []);
      setPaymentStats(paymentRes.data.stats || []);
    } catch (error) {
      console.error("Reports fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Analyze your expense trends, categories, and payment behavior."
    >
      <div className="space-y-6">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
                Dynamic Analytics
              </p>
              <h3 className="mt-4 text-2xl font-black">
                Financial insights that update with your filters
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Filter by category, payment method, and date range to understand
                exactly where your money is going.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <input
                name="category"
                value={filters.category}
                onChange={handleChange}
                placeholder="Category"
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
              />

              <select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
              >
                <option className="text-slate-950" value="">
                  All Methods
                </option>
                {PAYMENT_METHODS.map((method) => (
                  <option
                    className="text-slate-950"
                    key={method.value}
                    value={method.value}
                  >
                    {method.label}
                  </option>
                ))}
              </select>

              <input
                name="startDate"
                type="date"
                value={filters.startDate}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
              />

              <input
                name="endDate"
                type="date"
                value={filters.endDate}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
              />

              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
              >
                <RefreshCcw size={17} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid min-h-[50vh] place-items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <BarChart3 size={22} />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Filtered Expense
                </p>
                <h3 className="mt-2 text-3xl font-black text-slate-950">
                  {formatCurrency(totalFilteredExpense)}
                </h3>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CalendarDays size={22} />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Transactions
                </p>
                <h3 className="mt-2 text-3xl font-black text-slate-950">
                  {totalTransactions}
                </h3>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                  <PieChartIcon size={22} />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Top Category
                </p>
                <h3 className="mt-2 text-3xl font-black text-slate-950">
                  {topCategory}
                </h3>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-950">
                    Monthly Expense Trend
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Compare spending month by month using your selected filters.
                  </p>
                </div>

                {monthlyStats.length ? (
                  <MonthlyLineChart data={monthlyStats} />
                ) : (
                  <div className="grid h-80 place-items-center rounded-3xl bg-slate-50 text-slate-400">
                    No monthly data available
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-950">
                    Category Breakdown
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Category-wise spending distribution.
                  </p>
                </div>

                <CategoryPieChart data={categoryStats} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-950">
                  Payment Method Summary
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Understand how much you spend through cash and credit.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {paymentStats.length ? (
                  paymentStats.map((item) => {
                    const percentage = totalFilteredExpense
                      ? Math.round((item.total / totalFilteredExpense) * 100)
                      : 0;

                    return (
                      <div
                        key={item.paymentMethod}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-indigo-600">
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <p className="font-black capitalize text-slate-950">
                                {item.paymentMethod}
                              </p>
                              <p className="text-sm text-slate-500">
                                {item.count} transactions
                              </p>
                            </div>
                          </div>

                          <p className="text-xl font-black text-slate-950">
                            {percentage}%
                          </p>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <p className="mt-4 text-lg font-black text-slate-950">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full grid min-h-40 place-items-center rounded-3xl bg-slate-50 text-slate-400">
                    No payment method data available
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;