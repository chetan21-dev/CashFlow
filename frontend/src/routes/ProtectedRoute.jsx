import { Navigate, Outlet } from "react-router-dom";
import { getLocalStorage } from "../utils/localStorage";

export const ProtectedRoute = () => {
  const token = getLocalStorage("jwt_token");
  if (!token) return  <Navigate to={"/login"} />;
  else return <Outlet />;
};
