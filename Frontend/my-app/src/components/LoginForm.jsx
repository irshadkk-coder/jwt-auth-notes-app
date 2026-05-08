import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await loginUser(email, password);

      if (data.success) {
        onLogin(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="App introduction">
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NoteFlow</span>
        </div>

        <div className="auth-copy">
          <h1>Your notes, ready when your thoughts arrive.</h1>
          <p>
            Sign in to keep ideas, reminders, and drafts in one calm workspace.
          </p>
        </div>

        <div className="auth-stats" aria-label="Highlights">
          <div className="auth-stat">
            <strong>Private</strong>
            <span>Cookie based sessions</span>
          </div>
          <div className="auth-stat">
            <strong>Fast</strong>
            <span>Create and edit quickly</span>
          </div>
          <div className="auth-stat">
            <strong>Simple</strong>
            <span>No clutter in the way</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <form className="form-card" onSubmit={handleLogin}>
          <h2>Welcome back</h2>
          <p className="form-subtitle">Use your email and password to continue.</p>

          <div className="form-stack">
            {error && <div className="message error">{error}</div>}

            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="form-footer">
            <Link to="/register">Create account</Link>
            <button
              className="link-button"
              type="button"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginForm;
