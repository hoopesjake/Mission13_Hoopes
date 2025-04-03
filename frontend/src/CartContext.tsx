import React, { createContext, useState, useContext, useEffect } from 'react';

export interface CartItem {
    bookId: number;
    title: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    updateQuantity: (bookId: number, quantity: number) => void;
    clearCart: () => void;
    isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            sessionStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (item: CartItem) => {
        console.log("[addToCart] Adding:", item);
        setCart((prev) => {
            console.log("[addToCart] Current cart:", prev);
            const existing = prev.find((i) => i.bookId === item.bookId);
            if (existing) {
                console.log("[addToCart] Found match. Updating quantity.");
                return prev.map((i) =>
                    i.bookId === item.bookId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            console.log("[addToCart] New item. Adding to cart.");
            return [...prev, item];
        });
    };

    const removeFromCart = (bookId: number) => {
        setCart((prev) => prev.filter((item) => item.bookId !== bookId));
    };

    const updateQuantity = (bookId: number, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.bookId === bookId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isLoaded }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
