import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { path: "/", label: "Dashboard", icon: "⚡" },
    { path: "/add", label: "Add Product", icon: "✦" },
    { path: "/catalog", label: "Catalog", icon: "◈" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
    { path: "/bulk", label: "Bulk AI", icon: "🤖" },
    { path: "/templates", label: "Templates", icon: "❋" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg pulse-glow flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6339ff, #00c8ff)" }}
        >
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <span className="font-display font-bold text-lg tracking-tight shimmer-text">
          AICatalog
        </span>
      </div>

      {/* Links */}
      <div className="flex gap-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
              location.pathname === link.path
                ? "text-white glow-border"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            style={
              location.pathname === link.path
                ? {
                    background:
                      "linear-gradient(135deg, rgba(99,57,255,0.2), rgba(0,200,255,0.1))",
                  }
                : {}
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-3">
        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #6339ff, #ff3c78)" }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-white leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 leading-tight capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-2 rounded-xl transition-all"
          style={{
            background: "rgba(255,60,120,0.1)",
            color: "#ff3c78",
            border: "1px solid rgba(255,60,120,0.2)",
          }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
