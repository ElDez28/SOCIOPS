import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  if (isLoggedIn) return <Outlet></Outlet>;
  if (!isLoggedIn) return <Navigate to="/login" replace></Navigate>;
};

export default ProtectedRoute;
