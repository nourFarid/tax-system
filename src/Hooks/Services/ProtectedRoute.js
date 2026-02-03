import { Navigate } from "react-router-dom";
import { getAuthUser } from "./Storage";

const ProtectedRoute = ({ children }) => {
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
