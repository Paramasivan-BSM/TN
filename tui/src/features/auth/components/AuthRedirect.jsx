import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRedirect = () => {
  const { role } = useSelector((state) => state.auth);

  if (role === "ROLE_USER") {
    return <Navigate to="/userlayout" replace />;
  }

  if (role === "ROLE_WORKER") {
    return <Navigate to="/worker" replace />;
  }

  return <Navigate to="/" replace />;
};


export default AuthRedirect;
