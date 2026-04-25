import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { bulkUploadExpenses } from "../../api/expenseApi";
import { useToast } from "../../context/ToastContext";

const BulkUpload = ({ onUploaded }) => {
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await bulkUploadExpenses(formData);

      showToast(
        `${res.data.insertedCount || 0} expenses uploaded successfully.`,
        "success"
      );

      if (res.data.invalidCount > 0) {
        showToast(`${res.data.invalidCount} invalid rows skipped.`, "info");
      }

      onUploaded?.();
    } catch (error) {
      showToast(error.response?.data?.message || "CSV upload failed.", "error");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        <UploadCloud size={18} />
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </>
  );
};

export default BulkUpload;