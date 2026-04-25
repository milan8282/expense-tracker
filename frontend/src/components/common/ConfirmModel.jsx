import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={open} onClose={onCancel} title={title} subtitle={message}>
      <div className="rounded-3xl bg-slate-50 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl ${
              danger ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
            }`}
          >
            <AlertTriangle size={22} />
          </div>

          <div>
            <p className="font-bold text-slate-950">Please confirm this action</p>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`h-12 rounded-2xl px-5 text-sm font-bold text-white ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;