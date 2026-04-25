import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  LogOut,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: ReceiptText,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: PieChart,
  },
];

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <Link to="/dashboard" className="mb-10 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <Wallet />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-950">ExpenseFlow</h1>
          <p className="text-xs text-slate-400">Finance manager</p>
        </div>
      </Link>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-sm text-slate-300">Logged in as</p>
        <p className="mt-1 truncate font-bold">{user?.name}</p>
        <p className="truncate text-sm text-slate-400">{user?.email}</p>

        <button
          onClick={handleLogout}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-80 max-w-[85%] bg-white p-6 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f4f7fb]/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-2xl bg-white p-3 shadow-sm lg:hidden"
            >
              <Menu />
            </button>
          </div>
        </header>

        <section className="p-4 sm:p-6 lg:p-8">{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;