import Dashboard from "../components/Dashboard";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function DashboardPage({ user, setUser }) {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.log("Logout API failed", err);
  } finally {
    setUser(null);
    navigate("/login");
  }
};
  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default DashboardPage;