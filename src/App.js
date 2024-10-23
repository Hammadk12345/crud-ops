import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://openlibrary.org/search.json?q=react")
      .then((response) => {
        setBooks(response.data.docs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  const createBook = () => {
    const bookToAdd = {
      title: newBook.title,
      author: newBook.author,
      key: Date.now(),
    };
    setBooks([bookToAdd, ...books]);
    setNewBook({ title: "", author: "" });
  };

  const updateBook = () => {
    setBooks(books.map((book) => (book.key === editBook.key ? editBook : book)));
    setEditBook(null);
  };

  const deleteBook = (key) => {
    setBooks(books.filter((book) => book.key !== key));
  };

  if (loading) {
    return <h2>Loading books...</h2>;
  }

  return (
    <div className="App">
      <h1>Book List</h1>

      <div>
        <h3>Add a New Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <br />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <br />
        <button onClick={createBook}>Add Book</button>
      </div>

      <div>
        <h3>Books</h3>
        <ul>
          {books.map((book) => (
            <li key={book.key}>
              <h4>{book.title}</h4>
              <p>Author: {book.author_name ? book.author_name.join(", ") : "Unknown"}</p>
              <button className="edit-btn" onClick={() => setEditBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book.key)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {editBook && (
        <div>
          <h3>Edit Book</h3>
          <input
            type="text"
            value={editBook.title}
            onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
          />
          <br />
          <input
            type="text"
            value={editBook.author_name ? editBook.author_name.join(", ") : ""}
            onChange={(e) => setEditBook({ ...editBook, author_name: [e.target.value] })}
          />
          <br />
          <button onClick={updateBook}>Update Book</button>
        </div>
      )}
    </div>
  );
}

export default App;
