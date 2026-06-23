import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", icon: "📊", path: "/" },
    {
      label: "Products",
      icon: "📦",
      submenu: [
        { label: "Catalog", path: "/products/catalog" },
        { label: "Add Product", path: "/products/add" },
        { label: "Templates", path: "/products/templates" },
        { label: "Bulk Generate", path: "/products/bulk" },
      ],
    },
    { label: "Analytics", icon: "📈", path: "/analytics" },
    { label: "Reports", icon: "📊", path: "/reports" },
    { label: "Team", icon: "👥", path: "/team" },
    { label: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav
      className="glass border-b glow-border sticky top-0 z-50"
      style={{ borderBottomColor: "rgba(59, 130, 246, 0.2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #1e40af, #3b82f6)",
              }}
            >
              BMP
            </div>
            <span className="font-display font-bold text-white hidden sm:inline">
              Business Portal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition">
                    {item.icon} {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive(item.path)
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    style={
                      isActive(item.path)
                        ? {
                            background: "rgba(59, 130, 246, 0.2)",
                            borderBottom: "2px solid #3b82f6",
                          }
                        : {}
                    }
                  >
                    {item.icon} {item.label}
                  </Link>
                )}

                {/* Submenu */}
                {item.submenu && (
                  <div
                    className="absolute left-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                    style={{
                      background: "rgba(15, 23, 42, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      borderRadius: "12px",
                    }}
                  >
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        className={`block px-4 py-2.5 text-sm transition first:rounded-t-lg last:rounded-b-lg ${
                          isActive(subitem.path)
                            ? "text-blue-300 bg-blue-600/10"
                            : "text-gray-400 hover:text-white hover:bg-blue-600/5"
                        }`}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-gray-400">{user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-300 bg-red-600/10 hover:bg-red-600/20 transition border border-red-500/20"
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-600/10 transition"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
            <div className="space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <div className="text-sm font-medium text-gray-300 px-3 py-2">
                      {item.icon} {item.label}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive(item.path)
                          ? "text-blue-300 bg-blue-600/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.icon} {item.label}
                    </Link>
                  )}
                  {item.submenu && (
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          to={subitem.path}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            isActive(subitem.path)
                              ? "text-blue-300 bg-blue-600/10"
                              : "text-gray-500 hover:text-gray-400"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium text-red-300 bg-red-600/10 hover:bg-red-600/20 transition border border-red-500/20"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
