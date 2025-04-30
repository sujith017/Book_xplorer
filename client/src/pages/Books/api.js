import axios from 'axios';
const token = localStorage.getItem('authToken');
export const getBooks = async () => {
  try {
    console.log(token);
    const response = await axios.get('https://book-xplorer.onrender.com/api/books', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    console.log("hi");
    
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return { data: [] };  // Return empty array on error
  }
};

// Delete a book
export const deleteBook = async (id) => {
  try {
    const response = await axios.delete(`https://book-xplorer.onrender.com/api/books/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response;
  } catch (error) {
    console.error("Error deleting book:", error);
    return { data: { message: "Failed to delete book" } }; // Return default error message
  }
};
