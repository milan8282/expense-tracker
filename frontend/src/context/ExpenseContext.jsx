import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getExpenses } from "../api/expenseApi";

const ExpenseContext = createContext(null);

const initialFilters = {
  search: "",
  category: "",
  paymentMethod: "",
  startDate: "",
  endDate: "",
  sortLabel: "Newest Date",
  sortBy: "date",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const params = useMemo(
    () => ({
      search: filters.search || undefined,
      category: filters.category || undefined,
      paymentMethod: filters.paymentMethod || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: filters.page,
      limit: filters.limit,
    }),
    [filters]
  );

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getExpenses(params);
      setExpenses(res.data.expenses || []);
      setPagination(
        res.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        }
      );
    } catch (error) {
      console.error("Expense fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filters,
        setFilters,
        pagination,
        loading,
        fetchExpenses,
        resetFilters,
        params,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenseContext must be used inside ExpenseProvider");
  }

  return context;
};