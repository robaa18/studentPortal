import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

const getRoleName = (user) => {
  if (!user) return undefined;
  if (user.roleName) return user.roleName;
  return Number(user.role) === 0 ? "admin" : "student";
};

export default function ProtectedRoutes({ children, role }) {
  const { user, token, loading } = useAuth();
  const roleName = getRoleName(user);

  if (loading) return <LoadingSpinner />;

  if (!token || !user) return <Navigate to="/login" replace />;

  if (role && roleName !== role) {
    return <Navigate to={`/${roleName}/dashboard`} replace />;
  }

  return children;
}
