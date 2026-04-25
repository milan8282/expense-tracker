import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200 lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur">
              <Wallet />
            </div>
            <h1 className="text-2xl font-bold">ExpenseFlow</h1>
          </div>

          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm">
              Premium finance dashboard
            </p>
            <h2 className="max-w-md text-5xl font-bold leading-tight">
              Track spending with clarity and confidence.
            </h2>
            <p className="mt-6 max-w-md text-lg text-slate-300">
              Manage expenses, analyze trends, and make smarter monthly
              decisions from one beautiful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">24k+</p>
              <p className="text-sm text-slate-300">Records</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-slate-300">Categories</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">99%</p>
              <p className="text-sm text-slate-300">Accuracy</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white">
                <Wallet />
              </div>
              <h1 className="text-2xl font-bold">ExpenseFlow</h1>
            </div>

            <h2 className="text-4xl font-bold text-slate-950">Welcome back</h2>
            <p className="mt-3 text-slate-500">
              Login to continue managing your expenses.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-500">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-500">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;