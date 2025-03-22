import { useAccount } from "@/libs/hooks/useAccount";
import { Navigate, Outlet, useLocation } from "react-router";

export default function RequireAuth() {
  const { user, isLoadingUser } = useAccount();
  const location = useLocation();

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}
