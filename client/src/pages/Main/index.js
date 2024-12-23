import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Toast } from '../../services/sweetAlert';
import { InputSection, SubmitButton, BooksSection, ClearButton, QueryInput } from './styles';
import BookBlock from '../../components/BookBlock';

function Main() {
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const booksFromStorage = localStorage.getItem('books');
    const queryFromStorage = localStorage.getItem('query');
    if (booksFromStorage && queryFromStorage) {
      setBooks(JSON.parse(booksFromStorage));
      setQuery(queryFromStorage);
    }
  }, []);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function fetchBooks() {
      setLoading(true);
  
      const fetchWithRetry = async (retries = 3, delayTime = 1000) => {
          try {
              const response = await api.get(`/volumes?q=${query}`);
              if (!response.data.totalItems) {
                  setLoading(false);
                  return Toast.fire({
                      icon: 'error',
                      title: 'No books found with this query',
                  });
              }
  
              const books = response.data.items.map((book) => {
                  const thumbnailUrl = book.volumeInfo.imageLinks
                      ? book.volumeInfo.imageLinks.thumbnail
                      : 'https://books.google.com.br/googlebooks/images/no_cover_thumb.gif';
  
                  return {
                      id: book.id,
                      title: book.volumeInfo.title,
                      authors: book.volumeInfo.authors,
                      description: book.volumeInfo.description,
                      thumbnailUrl,
                  };
              });
  
              setBooks(books);
              localStorage.setItem('books', JSON.stringify(books));
              localStorage.setItem('query', query);
              setLoading(false);
          } catch (error) {
              if (error.response && error.response.status === 429 && retries > 0) {
                  const retryAfter = error.response.headers['retry-after'];
                  const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delayTime;
                  await delay(waitTime);
                  return fetchWithRetry(retries - 1, waitTime * 2);
              } else {
                  setLoading(false);
                  Toast.fire({
                      icon: 'error',
                      title: 'An error occurred while fetching books',
                  });
              }
          }
      };
  
      await fetchWithRetry();
  }
  
  function handleInput(event) {
    setQuery(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!query) {
      setError('You must type something!');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    await fetchBooks();
  }

  function handleClear(event) {
    event.preventDefault();

    setQuery('');
    setBooks([]);
    localStorage.removeItem('query');
    localStorage.removeItem('books');
  }

  return (
    <>
      <InputSection>
        <div className="container">
          <div className="logo">
            <h1>
              <span className="logo-blue">Book</span>Xplorer
            </h1>

            <h2>
              The <span className="logo-blue">right place</span> for you to find a book
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="label">
              <label htmlFor="book">Type an author or book name...</label>
            </div>

            <div className="input">
              <QueryInput
                onChange={handleInput}
                value={query}
                autoComplete="off"
                type="text"
                id="book"
                placeholder="Author or book name"
                width70={query && books.length}
              />

              {query && (
                <ClearButton type="button" onClick={handleClear}>
                  <i className="fas fa-times"></i>
                </ClearButton>
              )}

              <SubmitButton loading={loading ? 'loading' : undefined} type="submit">
                {loading ? <i className="fas fa-spinner"></i> : <i className="fas fa-search"></i>}
              </SubmitButton>
            </div>

            {error && (
              <div className="error">
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </InputSection>

      <BooksSection>
        <div className="container">
          {!books.length ? (
            <div className="no-books">
              {/* <img src={svg} alt="No books" /> */}
              <h1>No books yet, you need to search for some book</h1>
            </div>
          ) : (
            books.map((book, index) => <BookBlock book={book} key={index} />)
          )}
        </div>
      </BooksSection>
    </>
  );
}

export default Main;
