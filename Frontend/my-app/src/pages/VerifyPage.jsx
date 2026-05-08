import VerifyOTP from "../components/VerifyOTP";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <VerifyOTP
      email={state?.email}
      onVerified={() => navigate("/login")}
    />
  );
}

export default VerifyPage;