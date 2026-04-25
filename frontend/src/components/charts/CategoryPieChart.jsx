import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const CategoryPieChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  if (!chartData.length) {
    return (
      <div className="grid h-80 place-items-center rounded-3xl bg-slate-50 text-slate-400">
        No category data available
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={4}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [formatCurrency(value), "Expense"]}
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;