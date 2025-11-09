"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  phone: string;
  address: string;
  productId: string;
  productName: string;
  category: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  shippingFee: number;
  status: "주문접수" | "배송준비" | "배송중" | "배송완료";
  deliveryDate?: string;
  deliveryPhoto?: string;
  confirmationDoc?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "orderDate" | "status">) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  updateOrderFiles: (id: string, files: { deliveryPhoto?: string; confirmationDoc?: string; deliveryDate?: string }) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  // 사용자의 주문 내역 불러오기
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            status,
            total_amount,
            created_at,
            shipping_address,
            recipient_name,
            recipient_phone,
            payment_method,
            order_items (
              product_id,
              product_name,
              product_price,
              quantity
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error fetching orders:", error);
          throw error;
        }

        // Supabase 데이터를 Order 형식으로 변환
        const formattedOrders: Order[] = (data || []).map((item: any) => {
          const firstItem = item.order_items?.[0] || {};
          return {
            id: item.id,
            orderDate: new Date(item.created_at).toISOString().split("T")[0],
            customerName: item.recipient_name || "",
            phone: item.recipient_phone || "",
            address: item.shipping_address || "",
            productId: firstItem.product_id || "",
            productName: firstItem.product_name || "",
            category: "", // 카테고리 정보가 없으므로 빈 문자열
            productPrice: firstItem.product_price || 0,
            quantity: firstItem.quantity || 0,
            totalPrice: item.total_amount || 0,
            shippingFee: 0, // 배송비 정보가 별도로 없으므로 0
            status: item.status === "pending" ? "주문접수" :
                   item.status === "processing" ? "배송준비" :
                   item.status === "shipped" ? "배송중" :
                   item.status === "delivered" ? "배송완료" : "주문접수",
            deliveryDate: item.delivery_date,
            deliveryPhoto: item.delivery_photo,
            confirmationDoc: item.confirmation_doc,
          };
        });

        setOrders(formattedOrders);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        console.error("Error details:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
        });
      }
    };

    fetchOrders();
  }, [user]);

  const addOrder = async (order: Omit<Order, "id" | "orderDate" | "status">) => {
    if (!user) {
      console.error("User must be logged in to create an order");
      return;
    }

    try {
      // Supabase에 주문 생성
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            status: "pending",
            total_amount: order.totalPrice,
            shipping_address: order.address,
            recipient_name: order.customerName,
            recipient_phone: order.phone,
            payment_method: "무통장입금", // 기본값
            payment_status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 주문 상품 추가
      const { error: itemError } = await supabase
        .from("order_items")
        .insert([
          {
            order_id: newOrder.id,
            product_id: order.productId,
            product_name: order.productName,
            product_price: order.productPrice,
            quantity: order.quantity,
            subtotal: order.productPrice * order.quantity,
          },
        ]);

      if (itemError) throw itemError;

      // 로컬 상태 업데이트
      const localOrder: Order = {
        ...order,
        id: newOrder.id,
        orderDate: newOrder.created_at,
        status: "주문접수",
      };
      setOrders((prev) => [localOrder, ...prev]);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      // 한글 상태를 영문 상태로 변환
      const dbStatus =
        status === "주문접수" ? "pending" :
        status === "배송준비" ? "processing" :
        status === "배송중" ? "shipped" :
        status === "배송완료" ? "delivered" : "pending";

      // Supabase에서 주문 상태 업데이트
      const { error } = await supabase
        .from("orders")
        .update({ status: dbStatus })
        .eq("id", id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  const updateOrderFiles = async (
    id: string,
    files: { deliveryPhoto?: string; confirmationDoc?: string; deliveryDate?: string }
  ) => {
    try {
      // Supabase 필드명으로 변환
      const updateData: any = {};
      if (files.deliveryPhoto !== undefined) updateData.delivery_photo = files.deliveryPhoto;
      if (files.confirmationDoc !== undefined) updateData.confirmation_doc = files.confirmationDoc;
      if (files.deliveryDate !== undefined) updateData.delivery_date = files.deliveryDate;

      // Supabase에서 주문 파일 정보 업데이트
      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, ...files } : order
        )
      );
    } catch (error) {
      console.error("Error updating order files:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, updateOrderFiles }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
