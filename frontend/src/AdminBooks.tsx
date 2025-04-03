// ✅ AdminBooks.tsx — Full add/edit/delete functionality for Mission 13
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}

const emptyBook: Book = {
    bookID: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
};

const AdminBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [formBook, setFormBook] = useState<Book>(emptyBook);
    const [isEditing, setIsEditing] = useState(false);

    const fetchBooks = async () => {
        const res = await axios.get('/api/books?page=1&pageSize=100');
        setBooks(res.data.books);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormBook({ ...formBook, [name]: name === 'pageCount' || name === 'price' ? +value : value });
    };

    const handleSubmit = async () => {
        if (isEditing) {
            await axios.put(`/api/books/${formBook.bookID}`, formBook);
        } else {
            await axios.post('/api/books', formBook);
        }
        setFormBook(emptyBook);
        setIsEditing(false);
        fetchBooks();
    };

    const handleEdit = (book: Book) => {
        setFormBook(book);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        await axios.delete(`/api/books/${id}`);
        fetchBooks();
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">📚 Admin Book Manager</h2>

            <div className="card p-3 mb-4 shadow-sm">
                <h5>{isEditing ? '✏️ Edit Book' : '➕ Add New Book'}</h5>

                <div className="row g-3">
                    {Object.entries(emptyBook).map(([key]) => (
                        key !== 'bookID' && (
                            <div className="col-md-4" key={key}>
                                <input
                                    name={key}
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={(formBook as any)[key]}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        )
                    ))}
                </div>

                <div className="mt-3">
                    <button onClick={handleSubmit} className="btn btn-primary me-2">
                        {isEditing ? 'Update Book' : 'Add Book'}
                    </button>
                    {isEditing && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setFormBook(emptyBook);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <h5>📋 Existing Books</h5>
            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookID}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>${book.price.toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEdit(book)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(book.bookID)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminBooks;
