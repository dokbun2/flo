"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  }, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 로그인 시 장바구니 불러오기
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // 로그아웃 시 로컬스토리지에서 불러오기
      loadLocalCart();
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          quantity,
          products (
            title,
            price,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products.title,
        product_price: item.products.price,
        product_image: item.products.image_url,
        quantity: item.quantity,
      }));

      setItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCart = () => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading local cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocalCart = (newItems: CartItem[]) => {
    try {
      localStorage.setItem("cart", JSON.stringify(newItems));
    } catch (error) {
      console.error("Error saving local cart:", error);
    }
  };

  const addToCart = async (
    product: { id: string; title: string; price: number; imageUrl: string },
    quantity = 1
  ) => {
    if (user) {
      // 로그인 사용자 - DB에 저장
      try {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .single();

        if (existing) {
          // 이미 있으면 수량 증가
          const { error } = await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + quantity })
            .eq("id", existing.id);

          if (error) throw error;
        } else {
          // 없으면 새로 추가
          const { error } = await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: product.id,
            quantity,
          });

          if (error) throw error;
        }

        await fetchCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("장바구니 추가에 실패했습니다.");
      }
    } else {
      // 비로그인 사용자 - 로컬스토리지 사용
      const existingIndex = items.findIndex((item) => item.product_id === product.id);

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = [...items];
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems = [
          ...items,
          {
            id: `local-${Date.now()}`,
            product_id: product.id,
            product_name: product.title,
            product_price: product.price,
            product_image: product.imageUrl,
            quantity,
          },
        ];
      }

      setItems(newItems);
      saveLocalCart(newItems);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
        await fetchCart();
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      const newItems = items.filter((item) => item.product_id !== productId);
      setItems(newItems);
      saveLocalCart(newItems);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
        await fetchCart();
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      const newItems = items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      setItems(newItems);
      saveLocalCart(newItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);

        if (error) throw error;
        setItems([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      setItems([]);
      localStorage.removeItem("cart");
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.product_price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
