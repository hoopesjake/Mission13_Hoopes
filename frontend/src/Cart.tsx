import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, isLoaded } = useCart();
    const navigate = useNavigate();

    if (!isLoaded) return <div className="container mt-4">Loading cart...</div>;

    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const handleContinue = () => {
        const stored = sessionStorage.getItem("lastPageInfo");
        if (stored) {
            const { page, category } = JSON.parse(stored);
            const query = new URLSearchParams();
            if (page) query.set("page", page);
            if (category) query.set("category", category);
            navigate(`/?${query.toString()}`);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">🛒 Your Cart</h2>
            {cart.length === 0 ? (
                <div className="alert alert-warning">Your cart is empty.</div>
            ) : (
                <div className="row">
                    <div className="col-md-8">
                        <table className="table table-bordered align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.bookId}>
                                        <td>{item.title}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(item.bookId, Number(e.target.value))
                                                }
                                            />
                                        </td>
                                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeFromCart(item.bookId)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm p-3">
                            <h4 className="mb-3">Cart Summary</h4>
                            <p className="fs-5">
                                <strong>Total:</strong> ${total.toFixed(2)}
                            </p>
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleContinue}
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
