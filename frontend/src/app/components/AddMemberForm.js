"use client";
import { useState } from "react";

export default function AddMemberForm({ onMemberAdded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.detail || "Failed to add member");
      return;
    }

    setForm({
      name: "",
      email: "",
      phone: "",
    });

    onMemberAdded();
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Add Member</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
}