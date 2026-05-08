import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API from "../config/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (pass) => {
    if (!pass) return { label: "", color: "", width: "0%" };
    if (pass.length < 6)
      return { label: "Too short", color: "#ef4444", width: "20%" };
    if (pass.length < 8)
      return { label: "Weak", color: "#f97316", width: "40%" };
    if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass))
      return { label: "Medium", color: "#f59e0b", width: "65%" };
    return { label: "Strong", color: "#10b981", width: "100%" };
  };

  const strength = getStrength(form.password);
  const fields = [
    { name: "name", label: "Full Name", placeholder: "John Doe", type: "text" },
    {
      name: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      type: "email",
    },
  ];

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "#6339ff" }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-56 md:w-72 h-56 md:h-72 rounded-full opacity-8 blur-3xl"
          style={{ background: "#ff3c78" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl pulse-glow flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6339ff, #00c8ff)",
              }}
            >
              <span className="text-white font-bold text-base md:text-lg">
                AI
              </span>
            </div>
            <span className="font-display font-bold text-xl md:text-2xl shimmer-text">
              AICatalog
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
            Create account
          </h1>
          <p className="text-gray-400 text-sm">
            Start building AI-powered catalogs today
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-6 md:p-8 glow-border">
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {fields.map((f) => (
            <div key={f.name} className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                {f.label}
              </label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
          ))}

          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-dark w-full rounded-xl px-4 py-3 text-sm pr-12"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition text-sm"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {form.password && (
            <div className="mb-4">
              <div
                className="h-1.5 rounded-full mb-1"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: strength.width, background: strength.color }}
                />
              </div>
              <p className="text-xs" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              style={
                form.confirm && form.confirm !== form.password
                  ? { borderColor: "rgba(239,68,68,0.5)" }
                  : form.confirm && form.confirm === form.password
                    ? { borderColor: "rgba(16,185,129,0.5)" }
                    : {}
              }
            />
            {form.confirm && form.confirm !== form.password && (
              <p className="text-xs mt-1" style={{ color: "#f87171" }}>
                Passwords don't match
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-neon w-full text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 mb-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account →"
            )}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold transition hover:opacity-80"
              style={{ color: "#a78bfa" }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
