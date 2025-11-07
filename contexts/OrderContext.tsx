"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  addOrder: (order: Omit<Order, "id" | "orderDate" | "status">) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  updateOrderFiles: (id: string, files: { deliveryPhoto?: string; confirmationDoc?: string; deliveryDate?: string }) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// 초기 주문 데이터 (예시)
const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD001",
    orderDate: "2024-03-20",
    customerName: "김미영",
    phone: "010-1234-5678",
    category: "축하화환",
    productId: "P001",
    productName: "프리미엄 축하화환 A",
    productPrice: 150000,
    quantity: 1,
    totalPrice: 155000,
    shippingFee: 5000,
    address: "서울시 강남구 테헤란로 123",
    status: "배송준비",
  },
  {
    id: "ORD002",
    orderDate: "2024-03-20",
    customerName: "이철수",
    phone: "010-2345-6789",
    category: "꽃다발",
    productId: "P002",
    productName: "로즈 꽃다발 50송이",
    productPrice: 80000,
    quantity: 1,
    totalPrice: 83000,
    shippingFee: 3000,
    address: "서울시 서초구 반포대로 456",
    status: "배송중",
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // 클라이언트에서만 localStorage 로드
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
    }
  }, []);

  // orders 변경 시 localStorage 저장
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (order: Omit<Order, "id" | "orderDate" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
      orderDate: new Date().toISOString().split("T")[0],
      status: "주문접수",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const updateOrderFiles = (
    id: string,
    files: { deliveryPhoto?: string; confirmationDoc?: string; deliveryDate?: string }
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, ...files } : order
      )
    );
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
