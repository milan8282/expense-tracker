import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="text-center">
        <h1 className="text-7xl font-black text-slate-950">404</h1>
        <p className="mt-4 text-slate-500">Page not found.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white"
        >
          Go Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;