"use client";
import { useEffect, useState } from "react";
import {
  getBooks,
  getMembers,
  getBorrowed,
  borrowBook,
  returnBook
} from "../../lib/api";
import BookCard from "./components/BookCard";
import MemberSelector from "./components/MemberSelector";
import AddBookForm from "./components/AddBookForm";
import AddMemberForm from "./components/AddMemberForm";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [memberId, setMemberId] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = async (id = memberId) => {
    setLoading(true);
    const [booksData, membersData, borrowData] = await Promise.all([
      getBooks(),
      getMembers(),
      getBorrowed(id)
    ]);

    setBooks(booksData);
    setMembers(membersData);
    setBorrowRecords(borrowData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData(memberId);
  }, [memberId]);

  const handleBorrow = async (bookId) => {
    await borrowBook(bookId, memberId);
    loadData(memberId);
  };

  const handleReturn = async (borrowId) => {
    await returnBook(borrowId);
    loadData(memberId);
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Neighborhood Library</h1>

      <AddBookForm onBookAdded={() => loadData(memberId)} />
      <AddMemberForm onMemberAdded={() => loadData(memberId)} />

      <MemberSelector
        members={members}
        memberId={memberId}
        setMemberId={setMemberId}
      />

      <h2>Currently Borrowed Books</h2>

{borrowRecords.length === 0 ? (
  <p>No books currently borrowed.</p>
) : (
  borrowRecords.map(record => {
    const borrowedBook = books.find(
      book => book.id === record.book_id
    );

    return (
      <div
        key={record.id}
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px"
        }}
      >
        <p>
          Title: {borrowedBook ? borrowedBook.title : "Unknown"}
        </p>
        <p>
          Due Date:{" "}
          {new Date(record.due_date).toLocaleDateString()}
        </p>
      </div>
    );
  })
)}
      {books.map(book => {
        const activeBorrow = borrowRecords.find(
          b => b.book_id === book.id && !b.returned_at
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