import React from 'react';
import { useCart } from './CartContext';

const CartSummary: React.FC = () => {
    const { cart } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
            <div>
                🛒 <strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''} – <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            <a href="/cart" className="btn btn-sm btn-outline-primary">
                View Cart
            </a>
        </div>
    );
};

export default CartSummary;
