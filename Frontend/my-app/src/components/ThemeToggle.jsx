function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "day" : "dark"} mode`}
      title={`Switch to ${isDark ? "day" : "dark"} mode`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? "D" : "N"}
      </span>
      <span>{isDark ? "Day" : "Dark"}</span>
    </button>
  );
}

export default ThemeToggle;
