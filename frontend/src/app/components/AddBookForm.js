"use client";
import { useState } from "react";

export default function AddBookForm({ onBookAdded }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    total_copies: 1,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        total_copies: Number(form.total_copies),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.detail || "Failed to add book");
      return;
    }

    setForm({
      title: "",
      author: "",
      isbn: "",
      total_copies: 1,
    });

    onBookAdded();
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
        <input
          name="total_copies"
          type="number"
          placeholder="Copies"
          value={form.total_copies}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}