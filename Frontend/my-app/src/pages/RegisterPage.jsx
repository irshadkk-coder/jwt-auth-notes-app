import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <RegisterForm
      onSuccess={(email) => {
        navigate("/verify", { state: { email } });
      }}
    />
  );
}

export default RegisterPage;