import { useEffect, useRef, useCallback } from "react";

// Events that count as "user is active"
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

/**
 * Decodes a JWT's payload (no verification, just reading the exp claim).
 * Returns the expiry time in epoch milliseconds, or null if not found.
 */
function getTokenExpiryMs(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return null;
    return payload.exp * 1000; // exp is in seconds, convert to ms
  } catch {
    return null;
  }
}

/**
 * Combined inactivity + token-expiry session timeout hook.
 *
 * @param {string|null} token - current JWT (pass null/undefined if logged out, the hook will no-op)
 * @param {number} inactivityLimitMs - how long without activity before logout (default 15 min)
 * @param {(reason: 'inactivity' | 'expired') => void} onTimeout - called once when either limit is hit
 */
export function useSessionTimeout({
  token,
  inactivityLimitMs = 15 * 60 * 1000,
  onTimeout,
}) {
  const inactivityTimer = useRef(null);
  const expiryTimer = useRef(null);
  const firedRef = useRef(false); // guards against double-firing

  const fire = useCallback(
    (reason) => {
      if (firedRef.current) return;
      firedRef.current = true;
      onTimeout(reason);
    },
    [onTimeout],
  );

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(
      () => fire("inactivity"),
      inactivityLimitMs,
    );
  }, [inactivityLimitMs, fire]);

  useEffect(() => {
    if (!token) return;

    firedRef.current = false;

    // 1. Inactivity tracking
    resetInactivityTimer();
    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, resetInactivityTimer),
    );

    // 2. Token expiry tracking
    const expiryMs = getTokenExpiryMs(token);
    if (expiryMs) {
      const msUntilExpiry = expiryMs - Date.now();
      if (msUntilExpiry <= 0) {
        fire("expired");
      } else {
        expiryTimer.current = setTimeout(() => fire("expired"), msUntilExpiry);
      }
    }

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, resetInactivityTimer),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
}
