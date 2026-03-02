export const API_BASE = "http://127.0.0.1:8000";

//Reusable request helper
const request = async (url, options = {}) => {
  const res = await fetch(url, options);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.detail || "Something went wrong";
    throw new Error(message);
  }

  return data;
};

//GET APIs
export const getBooks = async () =>
  request(`${API_BASE}/books`);

export const getMembers = async () =>
  request(`${API_BASE}/members`);

export const getBorrowed = async (memberId) =>
  request(`${API_BASE}/members/${memberId}/borrowed`);

// 🔹 POST APIs
export const borrowBook = async (bookId, memberId) =>
  request(`${API_BASE}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id: bookId, member_id: memberId }),
  });

export const returnBook = async (borrowId) =>
  request(`${API_BASE}/return/${borrowId}`, {
    method: "POST",
  });

export const createMember = async (data) =>
  request(`${API_BASE}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const createBook = async (data) =>
  request(`${API_BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });