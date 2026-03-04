import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../lib/auth-store";

export function ProtectedRoute({ requiredRole, children }) {
  const token = useAuthStore((s) => s.token);
  const customer = useAuthStore((s) => s.customer);
  const location = useLocation();

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requiredRole && customer?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
