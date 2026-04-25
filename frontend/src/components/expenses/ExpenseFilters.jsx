import { Search, SlidersHorizontal, X } from "lucide-react";
import { PAYMENT_METHODS, SORT_OPTIONS } from "../../utils/constants";

const ExpenseFilters = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "sort") {
      const selected = SORT_OPTIONS.find((item) => item.label === value);

      setFilters((prev) => ({
        ...prev,
        sortLabel: value,
        sortBy: selected.sortBy,
        sortOrder: selected.sortOrder,
        page: 1,
      }));

      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const fieldClass =
    "h-12 w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-950">Filters</h3>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter and sort your expenses.
          </p>
        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <SlidersHorizontal size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-12">
        <div className="relative min-w-0 sm:col-span-2 xl:col-span-3">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search description/category..."
            className={`${fieldClass} pl-11`}
          />
        </div>

        <input
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Category"
          className={`xl:col-span-2 ${fieldClass}`}
        />

        <select
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={handleChange}
          className={`xl:col-span-2 ${fieldClass}`}
        >
          <option value="">All Methods</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>

        <input
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleChange}
          className={`xl:col-span-2 ${fieldClass}`}
        />

        <input
          name="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleChange}
          className={`xl:col-span-2 ${fieldClass}`}
        />

        <select
          name="sort"
          value={filters.sortLabel}
          onChange={handleChange}
          className={`sm:col-span-2 xl:col-span-2 ${fieldClass}`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:col-span-2 xl:col-span-1"
        >
          <X size={17} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilters;