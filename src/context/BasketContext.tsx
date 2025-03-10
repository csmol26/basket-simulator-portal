
import React, { createContext, useContext, useState, useEffect } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

export type BasketItem = {
  product: Product;
  quantity: number;
};

interface BasketContextType {
  items: BasketItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  totalItems: number;
  subtotal: number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Calculate totals whenever items change
  useEffect(() => {
    const newTotalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    setTotalItems(newTotalItems);
    setSubtotal(newSubtotal);
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Create a new array with the updated item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item to the array
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearBasket,
    totalItems,
    subtotal,
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};
