import Notes from "./Note";

function Dashboard({ user, onLogout }) {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="dashboard-title">
            <div className="brand">
              <span className="brand-mark">N</span>
              <span>NoteFlow</span>
            </div>
            <h1>Notes dashboard</h1>
            <p className="muted">Signed in as {user?.email}</p>
          </div>

          <button className="btn btn-secondary" type="button" onClick={onLogout}>
            Logout
          </button>
        </header>

        <Notes />
      </div>
    </main>
  );
}

export default Dashboard;
