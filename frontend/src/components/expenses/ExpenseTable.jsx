import { useState } from "react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import {
    bulkDeleteExpenses,
    deleteExpense,
    updateExpense,
} from "../../api/expenseApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, toInputDate } from "../../utils/formatDate";
import { PAYMENT_METHODS } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";


const ExpenseTable = ({
    expenses,
    pagination,
    filters,
    setFilters,
    loading,
    onChanged,
}) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const { showToast } = useToast();

    const allSelected =
        expenses.length > 0 && selectedIds.length === expenses.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(expenses.map((expense) => expense._id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const startEdit = (expense) => {
        setEditingId(expense._id);
        setEditForm({
            amount: expense.amount,
            description: expense.description,
            date: toInputDate(expense.date),
            category: expense.category,
            paymentMethod: expense.paymentMethod,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (e) => {
        setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const saveEdit = async (id) => {
        try {
            await updateExpense(id, {
                ...editForm,
                amount: Number(editForm.amount),
            });

            showToast("Expense updated successfully.", "success");
            cancelEdit();
            onChanged?.();
        } catch (error) {
            showToast(error.response?.data?.message || "Update failed.", "error");
        }
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Delete this expense?");
        if (!ok) return;

        try {
            await deleteExpense(id);
            showToast("Expense deleted successfully.", "success");
            onChanged?.();
        } catch (error) {
            showToast(error.response?.data?.message || "Delete failed.", "error");
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;

        const ok = window.confirm(`Delete ${selectedIds.length} selected expenses?`);
        if (!ok) return;

        try {
            const res = await bulkDeleteExpenses(selectedIds);

            showToast(
                `${res.data.deletedCount || selectedIds.length} expenses deleted successfully.`,
                "success"
            );

            setSelectedIds([]);
            onChanged?.();
        } catch (error) {
            showToast(error.response?.data?.message || "Bulk delete failed.", "error");
        }
    };
    
    const changePage = (page) => {
        if (page < 1 || page > pagination.totalPages) return;
        setFilters((prev) => ({ ...prev, page }));
    };

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-xl font-black text-slate-950">Expense Records</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {pagination.total || 0} total records found.
                    </p>
                </div>

                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                        <Trash2 size={17} />
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="min-w-[950px] w-full text-left">
                    <thead className="bg-slate-50 text-sm text-slate-500">
                        <tr>
                            <th className="px-5 py-4">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                            </th>
                            <th className="px-5 py-4 font-black">Description</th>
                            <th className="px-5 py-4 font-black">Category</th>
                            <th className="px-5 py-4 font-black">Method</th>
                            <th className="px-5 py-4 font-black">Date</th>
                            <th className="px-5 py-4 text-right font-black">Amount</th>
                            <th className="px-5 py-4 text-right font-black">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-5 py-16 text-center">
                                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                                </td>
                            </tr>
                        ) : expenses.length ? (
                            expenses.map((expense) => {
                                const isEditing = editingId === expense._id;

                                return (
                                    <tr
                                        key={expense._id}
                                        className="border-t border-slate-100 text-sm"
                                    >
                                        <td className="px-5 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(expense._id)}
                                                onChange={() => toggleSelect(expense._id)}
                                                className="h-4 w-4 rounded border-slate-300"
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            {isEditing ? (
                                                <input
                                                    name="description"
                                                    value={editForm.description}
                                                    onChange={handleEditChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-indigo-500"
                                                />
                                            ) : (
                                                <p className="font-bold text-slate-950">
                                                    {expense.description}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {isEditing ? (
                                                <input
                                                    name="category"
                                                    value={editForm.category}
                                                    onChange={handleEditChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-indigo-500"
                                                />
                                            ) : (
                                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                                                    {expense.category}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {isEditing ? (
                                                <select
                                                    name="paymentMethod"
                                                    value={editForm.paymentMethod}
                                                    onChange={handleEditChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-indigo-500"
                                                >
                                                    {PAYMENT_METHODS.map((method) => (
                                                        <option key={method.value} value={method.value}>
                                                            {method.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="capitalize text-slate-600">
                                                    {expense.paymentMethod}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {isEditing ? (
                                                <input
                                                    name="date"
                                                    type="date"
                                                    value={editForm.date}
                                                    onChange={handleEditChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-indigo-500"
                                                />
                                            ) : (
                                                <span className="text-slate-600">
                                                    {formatDate(expense.date)}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            {isEditing ? (
                                                <input
                                                    name="amount"
                                                    type="number"
                                                    value={editForm.amount}
                                                    onChange={handleEditChange}
                                                    className="ml-auto w-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right outline-none focus:border-indigo-500"
                                                />
                                            ) : (
                                                <span className="font-black text-slate-950">
                                                    {formatCurrency(expense.amount)}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(expense._id)}
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                        >
                                                            <Check size={17} />
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                        >
                                                            <X size={17} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEdit(expense)}
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                                        >
                                                            <Pencil size={17} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(expense._id)}
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-5 py-16 text-center">
                                    <p className="font-bold text-slate-700">No expenses found</p>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Try changing filters or add a new expense.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-slate-500">
                    Page <span className="font-bold">{pagination.page}</span> of{" "}
                    <span className="font-bold">{pagination.totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => changePage(filters.page - 1)}
                        disabled={filters.page <= 1}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40"
                    >
                        <ChevronLeft size={16} />
                        Prev
                    </button>

                    <button
                        onClick={() => changePage(filters.page + 1)}
                        disabled={filters.page >= pagination.totalPages}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTable;