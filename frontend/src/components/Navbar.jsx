import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="glass sticky top-0 z-50 px-4 md:px-6 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg pulse-glow flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6339ff, #00c8ff)" }}
          >
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight shimmer-text">
            AICatalog
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-1">
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

        {/* Right: Desktop user + logout / Mobile hamburger */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #6339ff, #ff3c78)",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 leading-tight capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
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

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all"
            style={{ background: "rgba(255,255,255,0.06)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block h-0.5 w-5 bg-white transition-all duration-300 origin-center"
              style={{
                transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-0.5 w-5 bg-white transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-0.5 w-5 bg-white transition-all duration-300 origin-center"
              style={{
                transform: menuOpen
                  ? "translateY(-8px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="md:hidden fixed top-[57px] left-0 right-0 z-40 px-4 pb-4 pt-2"
            style={{
              background: "linear-gradient(180deg, #0d0d1a 0%, #060612 100%)",
              borderBottom: "1px solid rgba(99,57,255,0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              animation: "slideDown 0.25s ease",
            }}
          >
            <style>{`
              @keyframes slideDown {
                from { transform: translateY(-10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>

            {/* User info row */}
            <div
              className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #6339ff, #ff3c78)",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Nav links */}
            <div className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={
                    location.pathname === link.path
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(99,57,255,0.2), rgba(0,200,255,0.1))",
                          color: "white",
                          border: "1px solid rgba(99,57,255,0.3)",
                        }
                      : {
                          color: "#9ca3af",
                          border: "1px solid transparent",
                        }
                  }
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-sm px-4 py-3 rounded-xl font-medium transition-all"
              style={{
                background: "rgba(255,60,120,0.1)",
                color: "#ff3c78",
                border: "1px solid rgba(255,60,120,0.2)",
              }}
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
