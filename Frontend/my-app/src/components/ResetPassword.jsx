import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      await resetPassword(token, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Create new password">
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NoteFlow</span>
        </div>

        <div className="auth-copy">
          <h1>Set a fresh password.</h1>
          <p>Choose a new password and continue to your notes.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="form-card" onSubmit={handleReset}>
          <h2>New password</h2>
          <p className="form-subtitle">Use something memorable and hard to guess.</p>

          <div className="form-stack">
            {error && <div className="message error">{error}</div>}

            <div className="field">
              <label htmlFor="reset-password">Password</label>
              <input
                id="reset-password"
                className="input"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Reset password"}
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

export default ResetPassword;
