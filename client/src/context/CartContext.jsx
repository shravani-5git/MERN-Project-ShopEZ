import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('shopez_bag');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopez_bag', JSON.stringify(items));
  }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          discountPercent: product.discountPercent || 0,
          imageUrl: product.imageUrl,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => {
    const effective = i.price - (i.price * i.discountPercent) / 100;
    return sum + effective * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
