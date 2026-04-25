import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  IndianRupee,
  ReceiptText,
  Trophy,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCategoryStats, getDashboardStats, getMonthlyStats } from "../api/statsApi";
import MonthlyLineChart from "../components/charts/MonthlyLineChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

const StatCard = ({ title, value, subtitle, icon: Icon, tone = "dark" }) => {
  const tones = {
    dark: "bg-slate-950 text-white",
    blue: "bg-indigo-600 text-white",
    green: "bg-emerald-600 text-white",
    light: "bg-white text-slate-950",
  };

  return (
    <div className={`rounded-3xl p-6 shadow-sm ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={tone === "light" ? "text-sm text-slate-500" : "text-sm text-white/70"}>
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">{value}</h3>
          <p className={tone === "light" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-white/70"}>
            {subtitle}
          </p>
        </div>

        <div
          className={
            tone === "light"
              ? "grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700"
              : "grid h-12 w-12 place-items-center rounded-2xl bg-white/15"
          }
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardRes, monthlyRes, categoryRes] = await Promise.all([
        getDashboardStats(),
        getMonthlyStats(),
        getCategoryStats(),
      ]);

      setDashboard(dashboardRes.data.data);
      setMonthlyStats(monthlyRes.data.stats || []);
      setCategoryStats(categoryRes.data.stats || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="A premium overview of your spending, trends, and recent activity."
    >
      {loading ? (
        <div className="grid min-h-[50vh] place-items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Expenses"
              value={formatCurrency(dashboard?.totalExpense)}
              subtitle={`${dashboard?.totalTransactions || 0} transactions tracked`}
              icon={IndianRupee}
              tone="dark"
            />

            <StatCard
              title="This Month"
              value={formatCurrency(dashboard?.thisMonthExpense)}
              subtitle={`${dashboard?.thisMonthTransactions || 0} monthly entries`}
              icon={CalendarDays}
              tone="blue"
            />

            <StatCard
              title="Average Spend"
              value={formatCurrency(dashboard?.averageExpense)}
              subtitle="Average per transaction"
              icon={CreditCard}
              tone="green"
            />

            <StatCard
              title="Top Category"
              value={dashboard?.topCategory || "N/A"}
              subtitle={formatCurrency(dashboard?.topCategoryAmount)}
              icon={Trophy}
              tone="light"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    Monthly Comparison
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Visualize your spending trend month by month.
                  </p>
                </div>

                <div className="hidden rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 sm:block">
                  Live Stats
                </div>
              </div>

              {monthlyStats.length ? (
                <MonthlyLineChart data={monthlyStats} />
              ) : (
                <div className="grid h-80 place-items-center rounded-3xl bg-slate-50 text-slate-400">
                  Add expenses to see monthly chart
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-950">
                  Category Breakdown
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  See where your money is going.
                </p>
              </div>

              <CategoryPieChart data={categoryStats} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Recent Expenses
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest spending records.
                </p>
              </div>

              <a
                href="/expenses"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Manage Expenses
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr] bg-slate-50 px-5 py-4 text-sm font-bold text-slate-500 md:grid">
                <span>Description</span>
                <span>Category</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
              </div>

              {dashboard?.latestExpenses?.length ? (
                dashboard.latestExpenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="grid gap-3 border-t border-slate-100 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <ReceiptText size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-950">
                          {expense.description}
                        </p>
                        <p className="text-sm capitalize text-slate-400 md:hidden">
                          {expense.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-600">
                      {expense.category}
                    </p>

                    <p className="text-sm text-slate-500">
                      {formatDate(expense.date)}
                    </p>

                    <p className="text-right font-black text-slate-950">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="grid min-h-40 place-items-center px-5 py-10 text-center">
                  <div>
                    <p className="font-bold text-slate-700">No expenses yet</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Add your first expense to populate dashboard data.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;