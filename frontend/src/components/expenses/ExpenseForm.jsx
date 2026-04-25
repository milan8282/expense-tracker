import { useEffect, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { createExpense, getCategorySuggestions } from "../../api/expenseApi";
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";

const initialForm = {
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    paymentMethod: "cash",
};

const ExpenseForm = ({ onCreated }) => {
    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const fetchCategories = async () => {
        try {
            const res = await getCategorySuggestions();
            const apiCategories = res.data.categories?.map((item) => item.name) || [];
            setCategories([...new Set([...apiCategories, ...DEFAULT_CATEGORIES])]);
        } catch {
            setCategories(DEFAULT_CATEGORIES);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (!form.amount || Number(form.amount) <= 0) return "Enter a valid amount.";
        if (!form.description.trim()) return "Description is required.";
        if (!form.date) return "Date is required.";
        if (!form.category.trim()) return "Category is required.";
        if (!form.paymentMethod) return "Payment method is required.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            await createExpense({
                amount: Number(form.amount),
                description: form.description,
                date: form.date,
                category: form.category,
                paymentMethod: form.paymentMethod,
            });

            showToast("Expense added successfully.", "success");

            setForm(initialForm);
            await fetchCategories();
            onCreated?.();

        } catch (err) {
            showToast(err.response?.data?.message || "Failed to create expense.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-xl font-black text-slate-950">Add Expense</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Create a new spending record with category suggestions.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Amount
                    </label>
                    <input
                        name="amount"
                        type="number"
                        min="1"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="2500"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Date
                    </label>
                    <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                    />
                </div>

                <div className="xl:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Description
                    </label>
                    <input
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Dinner, Uber ride, electricity bill..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Category
                    </label>
                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        list="category-suggestions"
                        placeholder="Food"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                    />
                    <datalist id="category-suggestions">
                        {categories.map((category) => (
                            <option key={category} value={category} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Payment Method
                    </label>
                    <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                    >
                        {PAYMENT_METHODS.map((method) => (
                            <option key={method.value} value={method.value}>
                                {method.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 xl:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                    >
                        <Plus size={18} />
                        {loading ? "Saving..." : "Add Expense"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setForm(initialForm)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        <RefreshCcw size={17} />
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;