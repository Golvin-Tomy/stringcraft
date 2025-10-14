

export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch {
    console.warn("Failed to save token");
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("token");
  } catch {
    console.warn("Failed to remove token");
  }
};

/* ---------------- CART ---------------- */

export const getCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cartItems) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch {
    console.warn("Failed to save cart");
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem("cart");
  } catch {
    console.warn("Failed to clear cart");
  }
};
