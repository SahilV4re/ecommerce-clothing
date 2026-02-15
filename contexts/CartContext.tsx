'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  product: {
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (
    productId: string,
    quantity?: number,
    size?: string,
    color?: string
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Fetch Cart
  // -------------------------
  const fetchCartItems = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        size,
        color,
        products (
          name,
          price,
          image_url,
          stock
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart items:', error);
    } else {
      setItems(
        data?.map((item) => ({
          ...item,
          product: item.products as any,
        })) || []
      );
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user, fetchCartItems]);

  const removeFromCart = useCallback(async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error removing from cart:', error);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);
  
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating quantity:', error);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );


  // -------------------------
  // Add to Cart
  // -------------------------
  const addToCart = useCallback(
    async (
      productId: string,
      quantity = 1,
      size?: string,
      color?: string
    ) => {
      if (!user) return;

      const existingItem = items.find(
        (item) =>
          item.product_id === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        return;
      }

      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        size,
        color,
      });

      if (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }

      await fetchCartItems();
    },
    [user, items, fetchCartItems, updateQuantity]
  );

  // -------------------------
  // Remove from Cart
  // -------------------------
  

  // -------------------------
  // Update Quantity
  // -------------------------
  

  // -------------------------
  // Clear Cart
  // -------------------------
  const clearCart = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      return;
    }

    setItems([]);
  }, [user]);

  // -------------------------
  // Derived Values
  // -------------------------
  const getCartTotal = useCallback(() => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  // -------------------------
  // Memoized Context Value
  // -------------------------
  const value = useMemo(
    () => ({
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    }),
    [
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
