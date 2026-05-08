import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";
import DashboardPage from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { getMe } from "./services/authService";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

useEffect(() => {
  const checkUser = async () => {
    try {
      const { data } = await getMe();

      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  checkUser();
}, []);

  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <Routes>

      {/* 🔥 default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" /> :
          <LoginPage setUser={setUser} />
        }
      />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />
      </Routes>
    </>
  );
}

export default App;
