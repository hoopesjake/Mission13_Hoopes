import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
    bookId: number;
    title: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    clearCart: () => void;
    updateQuantity: (bookId: number, quantity: number) => void;
    getSubtotal: () => number;
    isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("cart");
        if (stored) {
            setCart(JSON.parse(stored));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existing = prevCart.find((i) => i.bookId === item.bookId);
            if (existing) {
                return prevCart.map((i) =>
                    i.bookId === item.bookId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevCart, item];
        });
    };

    const removeFromCart = (bookId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (bookId: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.bookId === bookId
                    ? { ...item, quantity: Math.max(quantity, 1) }
                    : item
            )
        );
    };

    const getSubtotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                updateQuantity,
                getSubtotal,
                isLoaded,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
