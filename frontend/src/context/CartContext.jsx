import React, { createContext, useContext, useState, useEffect } from "react";

// Create Cart Context
const CartContext = createContext();

// Hook for easier access
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on init
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const exist = prev.find(item => item._id === product._id);
      if (exist) {
        return prev.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        return [...prev, { ...product, qty }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
