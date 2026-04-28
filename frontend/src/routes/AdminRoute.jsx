import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  //  attendre chargement user
  if (loading) return <p>Loading...</p>;

  //  pas connecté
  if (!user) return <Navigate to="/login" />;

  //  pas admin
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  //  autorisé
  return children;
}

export default AdminRoute;