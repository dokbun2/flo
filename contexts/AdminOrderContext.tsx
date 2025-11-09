"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface AdminOrder {
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
  userId: string; // 주문한 고객의 user_id
}

interface AdminOrderContextType {
  orders: AdminOrder[];
  loading: boolean;
  updateOrderStatus: (id: string, status: AdminOrder["status"]) => Promise<void>;
  updateOrderFiles: (
    id: string,
    files: { deliveryPhoto?: string; confirmationDoc?: string; deliveryDate?: string }
  ) => Promise<void>;
  updateOrder: (id: string, updates: Partial<AdminOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AdminOrderContext = createContext<AdminOrderContextType | undefined>(undefined);

export function AdminOrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // 모든 주문 내역 불러오기 (관리자용)
  const fetchOrders = async () => {
    // 관리자가 아니면 로딩 중단
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          user_id,
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
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching admin orders:", error);
        throw error;
      }

      // Supabase 데이터를 AdminOrder 형식으로 변환
      const formattedOrders: AdminOrder[] = (data || []).map((item: any) => {
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
          status:
            item.status === "pending"
              ? "주문접수"
              : item.status === "processing"
              ? "배송준비"
              : item.status === "shipped"
              ? "배송중"
              : item.status === "delivered"
              ? "배송완료"
              : "주문접수",
          deliveryDate: undefined,
          deliveryPhoto: undefined,
          confirmationDoc: undefined,
          userId: item.user_id,
        };
      });

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error("Error fetching admin orders:", error);
      console.error("Error details:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateOrderStatus = async (id: string, status: AdminOrder["status"]) => {
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      console.error("Only admins can update order status");
      return;
    }

    try {
      // 한글 상태를 영문 상태로 변환
      const dbStatus =
        status === "주문접수"
          ? "pending"
          : status === "배송준비"
          ? "processing"
          : status === "배송중"
          ? "shipped"
          : status === "배송완료"
          ? "delivered"
          : "pending";

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
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      console.error("Only admins can update order files");
      return;
    }

    try {
      // Supabase 필드명으로 변환
      const updateData: any = {};
      if (files.deliveryPhoto !== undefined) updateData.delivery_photo = files.deliveryPhoto;
      if (files.confirmationDoc !== undefined)
        updateData.confirmation_doc = files.confirmationDoc;
      if (files.deliveryDate !== undefined) updateData.delivery_date = files.deliveryDate;

      // Supabase에서 주문 파일 정보 업데이트
      const { error } = await supabase.from("orders").update(updateData).eq("id", id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, ...files } : order))
      );
    } catch (error) {
      console.error("Error updating order files:", error);
      throw error;
    }
  };

  const updateOrder = async (id: string, updates: Partial<AdminOrder>) => {
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      console.error("Only admins can update orders");
      return;
    }

    try {
      // Supabase 필드명으로 변환
      const updateData: any = {};
      if (updates.customerName !== undefined) updateData.recipient_name = updates.customerName;
      if (updates.phone !== undefined) updateData.recipient_phone = updates.phone;
      if (updates.address !== undefined) updateData.shipping_address = updates.address;
      if (updates.totalPrice !== undefined) updateData.total_amount = updates.totalPrice;

      // Supabase에서 주문 정보 업데이트
      const { error } = await supabase.from("orders").update(updateData).eq("id", id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, ...updates } : order))
      );
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      console.error("Only admins can delete orders");
      return;
    }

    try {
      // Supabase에서 주문 삭제 (order_items는 CASCADE로 자동 삭제됨)
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };

  return (
    <AdminOrderContext.Provider
      value={{ orders, loading, updateOrderStatus, updateOrderFiles, updateOrder, deleteOrder, refreshOrders: fetchOrders }}
    >
      {children}
    </AdminOrderContext.Provider>
  );
}

export function useAdminOrders() {
  const context = useContext(AdminOrderContext);
  if (context === undefined) {
    throw new Error("useAdminOrders must be used within an AdminOrderProvider");
  }
  return context;
}
