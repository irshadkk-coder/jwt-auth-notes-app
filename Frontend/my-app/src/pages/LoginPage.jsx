import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

function LoginPage({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = (data) => {
    setUser(data.user);
    navigate("/dashboard");
  };

  return <LoginForm onLogin={handleLogin} />;
}

export default LoginPage;