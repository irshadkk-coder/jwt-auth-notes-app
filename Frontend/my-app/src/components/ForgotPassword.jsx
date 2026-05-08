import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const { data } = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Password recovery">
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NoteFlow</span>
        </div>

        <div className="auth-copy">
          <h1>Get back to your workspace.</h1>
          <p>Enter your account email and we will send the reset details.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Reset access</h2>
          <p className="form-subtitle">Use the email connected to your account.</p>

          <div className="form-stack">
            {message && <div className="message">{message}</div>}
            {error && <div className="message error">{error}</div>}

            <div className="field">
              <label htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </div>

          <div className="form-footer">
            <Link to="/login">Back to sign in</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ForgotPassword;
