"use client";
import { useState } from "react";
import { createBook } from "../../lib/api";

export default function AddBookForm({ onBookAdded }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    total_copies: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBook({
        ...form,
        total_copies: Number(form.total_copies),
      });

      setForm({
        title: "",
        author: "",
        isbn: "",
        total_copies: 1,
      });

      onBookAdded();
    } catch (error) {
      alert(error.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <input
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
        />
        <input
          name="total_copies"
          type="number"
          placeholder="Copies"
          value={form.total_copies}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}