import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function RegisterForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await registerUser({ name, email, password });

      if (data.success) {
        onSuccess(email);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Account benefits">
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NoteFlow</span>
        </div>

        <div className="auth-copy">
          <h1>Start with a cleaner place for your thoughts.</h1>
          <p>
            Create an account, verify your email, and keep your notes available across sessions.
          </p>
        </div>

        <div className="auth-stats" aria-label="Highlights">
          <div className="auth-stat">
            <strong>Verified</strong>
            <span>Email OTP flow</span>
          </div>
          <div className="auth-stat">
            <strong>Organized</strong>
            <span>Notes stay editable</span>
          </div>
          <div className="auth-stat">
            <strong>Secure</strong>
            <span>Refresh token sessions</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <form className="form-card" onSubmit={handleRegister}>
          <h2>Create account</h2>
          <p className="form-subtitle">A few details and you are ready to verify.</p>

          <div className="form-stack">
            {error && <div className="message error">{error}</div>}

            <div className="field">
              <label htmlFor="register-name">Name</label>
              <input
                id="register-name"
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                className="input"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>

          <div className="form-footer">
            <span>Already registered?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegisterForm;
