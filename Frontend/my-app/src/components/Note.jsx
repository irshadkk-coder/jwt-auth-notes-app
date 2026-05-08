import { useCallback, useEffect, useState } from "react";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../services/noteService.js";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const fetchNotes = useCallback(async (searchValue = search, pageValue = page) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getNotes(searchValue, pageValue);

      if (data.success) {
        setNotes(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalNotes(data.totalNotes || 0);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Could not load notes");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    Promise.resolve().then(() => fetchNotes());
  }, [fetchNotes]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("Both title and content are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        const { data } = await updateNote(editingId, {
          title: trimmedTitle,
          content: trimmedContent,
        });

        if (data.success) {
          await fetchNotes(search, page);
        }
      } else {
        const { data } = await createNote({
          title: trimmedTitle,
          content: trimmedContent,
        });

        if (data.success) {
          setPage(1);
          await fetchNotes(search, 1);
        }
      }

      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError("");
      await deleteNote(id);
      await fetchNotes(search, page);
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  return (
    <section className="dashboard-grid" aria-label="Notes workspace">
      <form className="panel note-composer" onSubmit={handleSubmit}>
        <div className="notes-header">
          <div>
            <h2>{editingId ? "Edit note" : "New note"}</h2>
            <p className="muted">
              {editingId ? "Update the selected note." : "Capture a thought quickly."}
            </p>
          </div>
        </div>

        <div className="form-stack">
          {error && <div className="message error">{error}</div>}

          <div className="field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="input"
              type="text"
              placeholder="Meeting notes, idea, reminder..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="textarea"
              placeholder="Write the details here."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="button-row">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Working..." : editingId ? "Update note" : "Add note"}
            </button>

            {editingId && (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="panel notes-panel">
        <div className="notes-header">
          <div>
            <h2>Your notes</h2>
            <p className="muted">
              {loading ? "Syncing latest changes..." : "Browse, edit, or remove notes."}
            </p>
          </div>
          <span className="count-pill">{totalNotes} notes</span>
        </div>

        <div className="notes-toolbar">
          <input
            type="search"
            className="input"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {!loading && notes.length === 0 ? (
          <div className="empty-state">
            <div>
              <strong>No notes yet</strong>
              <p>Create your first note from the composer.</p>
            </div>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <article className="note-card" key={note._id}>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                </div>

                <div className="note-actions">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary"
              type="button"
              disabled={loading || page <= 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            >
              Previous
            </button>
            <span className="muted">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={loading || page >= totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Notes;
