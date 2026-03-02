export default function BookCard({ book, activeBorrow, onBorrow, onReturn }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "6px"
    }}>
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Available Copies: {book.available_copies}</p>

      {!activeBorrow ? (
  <button
    onClick={() => onBorrow(book.id)}
    disabled={book.available_copies === 0}
  >
    Borrow
  </button>
) : (
  <>
    <p>
      Due Date:{" "}
      {new Date(activeBorrow.due_date).toLocaleDateString()}
    </p>

    <button onClick={() => onReturn(activeBorrow.id)}>
      Return
    </button>
  </>
)}
    </div>
  );
}