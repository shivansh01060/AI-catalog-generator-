import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap your authenticated routes/layout with this, e.g.:
 *
 * <SessionGuard>
 *   <DashboardLayout>...</DashboardLayout>
 * </SessionGuard>
 */
export default function SessionGuard({
  children,
  inactivityLimitMs = 15 * 60 * 1000,
}) {
  const { user, logout } = useAuth();
  const token = user?.token ?? null; // AuthContext stores the token inside `user`, not separately
  const navigate = useNavigate();

  const handleTimeout = useCallback(
    (reason) => {
      logout();
      navigate("/login", {
        replace: true,
        state: { sessionExpired: true, reason }, // read this on the Login page for a "session expired" message
      });
    },
    [logout, navigate],
  );

  useSessionTimeout({ token, inactivityLimitMs, onTimeout: handleTimeout });

  return children;
}
