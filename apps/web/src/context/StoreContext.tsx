import React, { createContext, useContext, useState } from 'react';
import { Book } from '../mock/data';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => boolean;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => boolean;
  clearCart: () => void;
  subtotal: number;
  favourites: string[];
  toggleFavourite: (bookId: string) => void;
  isFavourite: (bookId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);

  const addToCart = (book: Book, quantity = 1): boolean => {
    if (!book.inStock || (book.stockCount !== undefined && book.stockCount <= 0)) {
      return false;
    }

    const existing = cart.find((item) => item.book.id === book.id);
    const currentQty = existing ? existing.quantity : 0;
    const targetQty = currentQty + quantity;

    if (book.stockCount !== undefined && targetQty > book.stockCount) {
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, quantity }];
    });

    return true;
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return true;
    }

    const itemToUpdate = cart.find((item) => item.book.id === bookId);
    if (itemToUpdate && itemToUpdate.book.stockCount !== undefined && quantity > itemToUpdate.book.stockCount) {
      return false;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.book.id !== bookId) return item;
        return { ...item, quantity };
      })
    );

    return true;
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => {
    const effectivePrice = item.book.discountPrice ?? item.book.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  const toggleFavourite = (bookId: string) => {
    setFavourites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const isFavourite = (bookId: string) => favourites.includes(bookId);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        favourites,
        toggleFavourite,
        isFavourite,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
