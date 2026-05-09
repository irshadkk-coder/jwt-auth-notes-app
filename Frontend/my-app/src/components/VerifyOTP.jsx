import { useState } from "react";
import { Link } from "react-router-dom";


function VerifyOTP({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);import { verifyOTP } from "../services/authService";
      const { data } = await verifyOTP(email, otp);

      if (data.success) {
        onVerified();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Email verification">
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NoteFlow</span>
        </div>

        <div className="auth-copy">
          <h1>Verify your email to finish setup.</h1>
          <p>Enter the OTP sent to your inbox and your account will be ready.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="form-card" onSubmit={handleVerify}>
          <h2>Email verification</h2>
          <p className="form-subtitle">{email || "No email was provided."}</p>

          <div className="form-stack">
            {error && <div className="message error">{error}</div>}

            <div className="field">
              <label htmlFor="verify-otp">OTP</label>
              <input
                id="verify-otp"
                className="input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading || !email}>
              {loading ? "Verifying..." : "Verify email"}
            </button>
          </div>

          <div className="form-footer">
            <Link to="/register">Use another email</Link>
            <Link to="/login">Back to sign in</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default VerifyOTP;
