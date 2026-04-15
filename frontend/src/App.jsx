import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  async function loadEmails() {
    try {
      setStatus("Loading emails...");
      const res = await fetch(`${API_BASE}/emails`);
      const data = await res.json();
      setEmails(data);
      setStatus("Emails loaded successfully");
    } catch (error) {
      setStatus("Failed to load emails");
      console.error(error);
    }
  }

  useEffect(() => {
    loadEmails();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setStatus("Please enter name and email");
      return;
    }

    try {
      setLoading(true);
      setStatus("Saving email...");
      const res = await fetch(`${API_BASE}/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Save failed");

      setForm({ name: "", email: "" });
      await loadEmails();
      setStatus("Email saved successfully");
    } catch (error) {
      setStatus("Failed to save email");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      setStatus("Deleting email...");
      const res = await fetch(`${API_BASE}/emails/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      await loadEmails();
      setStatus("Email deleted successfully");
    } catch (error) {
      setStatus("Failed to delete email");
      console.error(error);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Stackly Email App</h1>
        <p className="sub">
          Beginner-friendly full stack project for Jenkins CI/CD using React, FastAPI, MySQL, Nginx, and AWS EC2.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        <p className="status">{status}</p>

        <h2>Saved Emails</h2>
        {emails.length === 0 ? (
          <p>No emails found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <button className="deleteBtn" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
