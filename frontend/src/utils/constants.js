export const PAYMENT_METHODS = [
  { label: "Cash", value: "cash" },
  { label: "Credit", value: "credit" },
];

export const DEFAULT_CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Rent",
  "Health",
  "Education",
  "Entertainment",
  "Fuel",
  "Groceries",
  "Subscriptions",
  "Other",
];

export const SORT_OPTIONS = [
  { label: "Newest Date", sortBy: "date", sortOrder: "desc" },
  { label: "Oldest Date", sortBy: "date", sortOrder: "asc" },
  { label: "Highest Amount", sortBy: "amount", sortOrder: "desc" },
  { label: "Lowest Amount", sortBy: "amount", sortOrder: "asc" },
  { label: "Category A-Z", sortBy: "category", sortOrder: "asc" },
];