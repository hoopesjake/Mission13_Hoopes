import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import CategoryFilter from "./CategoryFilter";
import CartSummary from "./CartSummary";
import { useCart } from "./CartContext";
import { useSearchParams } from "react-router-dom";

// ✅ Set correct backend URL
axios.defaults.baseURL = "https://mission13hoopes-backend-a4bbdfgkabd4f3eq.eastus-01.azurewebsites.net";


interface Book {
    bookId: number; // ✅ match backend response casing
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}

const BookList = () => {
    const [searchParams] = useSearchParams();
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("category") || ""
    );

    const { addToCart } = useCart();

    const fetchBooks = async () => {
        try {
            const res = await axios.get("/api/books", {
                params: {
                    page,
                    pageSize,
                    sort: "title",
                    category: selectedCategory || undefined,
                },
            });
            setBooks(res.data.books);
            setTotal(res.data.total);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [page, pageSize, selectedCategory]);

    useEffect(() => {
        axios.get("/api/books/categories").then((res) => {
            setCategories(res.data);
        });
    }, []);

    return (
        <div className="container mt-4">
            <CartSummary />

            <h2 className="mb-3">📚 Book List</h2>

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    setPage(1);
                }}
            />

            <div className="mb-3">
                <label className="me-2">Books per page:</label>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    {[5, 10, 15].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Pages</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {books.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center">
                                No books found.
                            </td>
                        </tr>
                    ) : (
                        books.map((book) => (
                            <tr key={book.bookId}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{book.isbn}</td>
                                <td>{book.classification}</td>
                                <td>{book.category}</td>
                                <td>{book.pageCount}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => {
                                            sessionStorage.setItem(
                                                "lastPageInfo",
                                                JSON.stringify({ page, category: selectedCategory })
                                            );

                                            const selectedBook = {
                                                bookId: book.bookId, // ✅ this was the fix
                                                title: book.title,
                                                price: book.price,
                                                quantity: 1,
                                            };

                                            addToCart(selectedBook);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center">
                <button
                    className="btn btn-primary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    className="btn btn-primary"
                    disabled={page * pageSize >= total}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BookList;
