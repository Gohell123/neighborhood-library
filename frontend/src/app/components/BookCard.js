"use client";
import { useState } from "react";

export default function BookCard({ book, activeBorrow, onBorrow, onReturn }) {
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    setLoading(true);
    try {
      await onBorrow(book.id);
    } catch (error) {
      alert(error.message || "Failed to borrow book");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    setLoading(true);
    try {
      await onReturn(activeBorrow.id);
    } catch (error) {
      alert(error.message || "Failed to return book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "6px",
      }}
    >
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Available Copies: {book.available_copies}</p>

      {!activeBorrow ? (
        <button
          onClick={handleBorrow}
          disabled={loading || book.available_copies === 0}
        >
          {loading ? "Processing..." : "Borrow"}
        </button>
      ) : (
        <>
          <p>
            Due Date:{" "}
            {new Date(activeBorrow.due_date).toLocaleDateString()}
          </p>

          <button
            onClick={handleReturn}
            disabled={loading}
          >
            {loading ? "Processing..." : "Return"}
          </button>
        </>
      )}
    </div>
  );
}