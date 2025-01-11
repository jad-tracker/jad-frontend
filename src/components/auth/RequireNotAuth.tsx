import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";

export default function RequireNotAuth() {
  const {authenticated} = useAuth();
  const {state} = useLocation();

  return !authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={state?.path ?? "/"}  state={{}} replace />
  );
}