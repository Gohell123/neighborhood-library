"use client";
import { useEffect, useState } from "react";
import {
  getBooks,
  getMembers,
  getBorrowed,
  borrowBook,
  returnBook,
} from "../lib/api";

import BookCard from "./components/BookCard";
import MemberSelector from "./components/MemberSelector";
import AddBookForm from "./components/AddBookForm";
import AddMemberForm from "./components/AddMemberForm";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [memberId, setMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Load All Data
  const loadData = async (selectedMemberId) => {
    try {
      setLoading(true);
      setError(null);

      const [booksData, membersData] = await Promise.all([
        getBooks(),
        getMembers(),
      ]);

      setBooks(booksData);
      setMembers(membersData);

      // Set default member if not selected
      const currentMemberId =
        selectedMemberId ?? membersData?.[0]?.id ?? null;

      setMemberId(currentMemberId);

      if (currentMemberId) {
        const borrowData = await getBorrowed(currentMemberId);
        setBorrowRecords(borrowData);
      } else {
        setBorrowRecords([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // When member changes → only reload borrowed books
  useEffect(() => {
    const fetchBorrowed = async () => {
      if (!memberId) return;

      try {
        setLoading(true);
        const borrowData = await getBorrowed(memberId);
        setBorrowRecords(borrowData);
      } catch (err) {
        setError(err.message || "Failed to load borrowed books");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowed();
  }, [memberId]);

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId, memberId);
      await loadData(memberId);
    } catch (err) {
      alert(err.message || "Borrow failed");
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await returnBook(borrowId);
      await loadData(memberId);
    } catch (err) {
      alert(err.message || "Return failed");
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

  if (error)
    return (
      <p style={{ padding: 40, color: "red" }}>
        Error: {error}
      </p>
    );

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Neighborhood Library</h1>

      <AddBookForm onBookAdded={() => loadData(memberId)} />
      <AddMemberForm onMemberAdded={() => loadData(memberId)} />

      <MemberSelector
        members={members}
        memberId={memberId}
        setMemberId={setMemberId}
        loading={loading}
      />

      <h2>Currently Borrowed Books</h2>

      {borrowRecords.length === 0 ? (
        <p>No books currently borrowed.</p>
      ) : (
        borrowRecords.map((record) => {
          const borrowedBook = books.find(
            (book) => book.id === record.book_id
          );

          return (
            <div
              key={record.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <p>
                Title:{" "}
                {borrowedBook ? borrowedBook.title : "Unknown"}
              </p>
              <p>
                Due Date:{" "}
                {new Date(record.due_date).toLocaleDateString()}
              </p>
            </div>
          );
        })
      )}

      {books.map((book) => {
        const activeBorrow = borrowRecords.find(
          (b) => b.book_id === book.id && !b.returned_at
        );

        return (
          <BookCard
            key={book.id}
            book={book}
            activeBorrow={activeBorrow}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        );
      })}
    </div>
  );
}