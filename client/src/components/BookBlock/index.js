import React from 'react';
import { Link } from 'react-router-dom';

import { BookBlock as BookBlockStyled } from './styles';

const BookBlock = (props) => {
  const { id, thumbnailUrl, title, authors, description } = props.book;

  const handleAddBook = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("You need to be logged in to add a book.");
      return;
    }

    const bookData = {
      id,
      thumbnailUrl,
      title,
      authors,
      description,
    };

    try {
      const response = await fetch('https://book-xplorer.onrender.com/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Book added:", data);
      alert('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <BookBlockStyled>
      <div className="thumbnail">
        <img src={thumbnailUrl} alt={`${title} - Thumbnail`} />
      </div>
      <div className="book-data">
        <div className="main-info">
          <h3>{title}</h3>
          <h5>{authors ? authors.join(', ') : ''}</h5>
        </div>
        <p>{description}</p>
        <div className="details">
          <Link to={`/bookspage/${encodeURIComponent(id)}`}>
            DETAILS <i className="fas fa-info-circle"></i>
          </Link>
        </div>
        <button onClick={handleAddBook}>Add Book</button>
      </div>
    </BookBlockStyled>
  );
};

export default BookBlock;
