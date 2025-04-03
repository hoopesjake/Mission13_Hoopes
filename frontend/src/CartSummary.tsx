import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const CartSummary = () => {
    const { cart, getSubtotal } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = getSubtotal().toFixed(2);

    return (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
            <div>
                🛒 {totalItems} item{totalItems !== 1 && "s"} – <strong>${subtotal}</strong>
            </div>
            <Link to="/cart" className="btn btn-outline-primary btn-sm">
                View Cart
            </Link>
        </div>
    );
};

export default CartSummary;
