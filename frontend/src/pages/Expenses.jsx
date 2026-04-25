import { useState } from "react";
import { Download, Plus } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseTable from "../components/expenses/ExpenseTable";
import BulkUpload from "../components/expenses/BulkUpload";
import Modal from "../components/common/Modal";
import { exportExpensesCsv } from "../api/expenseApi";
import { useExpenseContext } from "../context/ExpenseContext";
import { useToast } from "../context/ToastContext";

const Expenses = () => {
  const { expenses, filters, setFilters, pagination, loading, fetchExpenses, resetFilters, params } =
    useExpenseContext();

  const { showToast } = useToast();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const downloadExpensesCsv = async () => {
    try {
      const res = await exportExpensesCsv(params);

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `expenses-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      showToast("Expense CSV downloaded successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "CSV download failed.", "error");
    }
  };

  return (
    <DashboardLayout
      title="Expenses"
      subtitle="Create, filter, edit, upload and manage every expense record."
    >
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-3xl bg-slate-950 p-5 text-white shadow-sm lg:flex-row lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              Full Expense Control
            </p>
            <h3 className="mt-4 text-2xl font-black">
              Manage expenses like a finance pro
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Add entries in a clean modal, upload CSV files, edit inline, delete in bulk,
              and export filtered expense data.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={downloadExpensesCsv}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
            >
              <Download size={18} />
              Download CSV
            </button>

            <BulkUpload onUploaded={fetchExpenses} />

            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Expense
            </button>
          </div>
        </div>

        <ExpenseFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />

        <ExpenseTable
          expenses={expenses}
          pagination={pagination}
          filters={filters}
          setFilters={setFilters}
          loading={loading}
          onChanged={fetchExpenses}
        />

        <Modal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add New Expense"
          subtitle="Fill the expense details. Dashboard and reports will update automatically."
        >
          <ExpenseForm
            onCreated={fetchExpenses}
            onSuccess={() => setAddModalOpen(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;