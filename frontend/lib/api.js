export const API_BASE = "http://127.0.0.1:8000";

export const getBooks = async () =>
  fetch(`${API_BASE}/books`).then(res => res.json());

export const getMembers = async () =>
  fetch(`${API_BASE}/members`).then(res => res.json());

export const getBorrowed = async (memberId) =>
  fetch(`${API_BASE}/members/${memberId}/borrowed`)
    .then(res => res.json());

export const borrowBook = async (bookId, memberId) =>
  fetch(`${API_BASE}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id: bookId, member_id: memberId })
  });

export const returnBook = async (borrowId) =>
  fetch(`${API_BASE}/return/${borrowId}`, {
    method: "POST"
  });

export const createMember = async (data) =>
  fetch(`${API_BASE}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export const createBook = async (data) =>
  fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });