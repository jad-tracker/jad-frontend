import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";

export default function RequireAuth() {
  const {authenticated} = useAuth();
  const location = useLocation();

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{path: location.pathname}} replace />
  );
}