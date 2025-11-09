"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { ShoppingCart, Package, User, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_status: string;
  shipping_address: string;
  recipient_name: string;
  recipient_phone: string;
  payment_method: string;
  notes: string;
  order_items: {
    product_name: string;
    product_price: number;
    quantity: number;
  }[];
}

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { items: cartItems, loading: cartLoading, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // 관리자 권한이 있으면 admin 페이지로 리다이렉트
    if (user.role === "admin" || user.role === "super_admin") {
      router.push("/admin");
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setOrdersLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total_amount,
          created_at,
          payment_status,
          shipping_address,
          recipient_name,
          recipient_phone,
          payment_method,
          notes,
          order_items (
            product_name,
            product_price,
            quantity
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    if (confirm("장바구니에서 삭제하시겠습니까?")) {
      await removeFromCart(productId);
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      pending: { label: "주문대기", className: "bg-yellow-100 text-yellow-800" },
      processing: { label: "처리중", className: "bg-blue-100 text-blue-800" },
      shipped: { label: "배송중", className: "bg-purple-100 text-purple-800" },
      delivered: { label: "배송완료", className: "bg-green-100 text-green-800" },
      cancelled: { label: "취소됨", className: "bg-red-100 text-red-800" },
    };
    const badge = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{user.name}님</h1>
              <p className="text-sm text-neutral-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("cart")}
            className={`pb-3 border-b-2 font-medium transition-colors ${
              activeTab === "cart"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>장바구니</span>
              {cartItems.length > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 border-b-2 font-medium transition-colors ${
              activeTab === "orders"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>주문 내역</span>
            </div>
          </button>
        </div>
      </div>

      {/* 장바구니 탭 */}
      {activeTab === "cart" && (
        <div>
          {cartLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500 text-lg mb-2">장바구니가 비어있습니다</p>
              <p className="text-neutral-400 text-sm">상품을 담아보세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-neutral-200 rounded-lg p-4 flex gap-4"
                >
                  {/* 상품 이미지 */}
                  <div className="relative w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product_image || "/placeholder-product.svg"}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-1">{item.product_name}</h3>
                    <p className="text-primary-600 font-bold mb-2">{formatPrice(item.product_price)}</p>

                    {/* 수량 조절 */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                        className="w-8 h-8 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => handleRemoveFromCart(item.product_id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <p className="font-bold text-neutral-900">
                      {formatPrice(item.product_price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              {/* 총액 */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-neutral-700">총 결제금액</span>
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(getCartTotal())}</span>
                </div>
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  주문하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 주문 내역 탭 */}
      {activeTab === "orders" && (
        <div>
          {ordersLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500 text-lg mb-2">주문 내역이 없습니다</p>
              <p className="text-neutral-400 text-sm">첫 주문을 시작해보세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                  {/* 주문 헤더 */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 mb-1">
                          주문일: {new Date(order.created_at).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                        <p className="text-xs text-neutral-500">주문번호: {order.id}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(order.status)}
                        {order.payment_status && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.payment_status === 'paid' ? '결제완료' :
                             order.payment_status === 'pending' ? '결제대기' :
                             order.payment_status === 'failed' ? '결제실패' :
                             order.payment_status === 'refunded' ? '환불완료' : order.payment_status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* 주문 상품 목록 */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3">주문 상품</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 px-3 bg-neutral-50 rounded-lg">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-neutral-900">{item.product_name}</span>
                              <span className="text-sm text-neutral-600 ml-2">x {item.quantity}</span>
                            </div>
                            <span className="text-sm font-semibold text-neutral-900">
                              {formatPrice(item.product_price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 배송 정보 */}
                    <div className="border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3">배송 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-neutral-600 w-24 flex-shrink-0">수령인</span>
                          <span className="text-neutral-900 font-medium">{order.recipient_name || '-'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-neutral-600 w-24 flex-shrink-0">연락처</span>
                          <span className="text-neutral-900 font-medium">{order.recipient_phone || '-'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-neutral-600 w-24 flex-shrink-0">배송지</span>
                          <span className="text-neutral-900">{order.shipping_address || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3">결제 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">결제 수단</span>
                          <span className="text-neutral-900 font-medium">{order.payment_method || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                          <span className="font-semibold text-neutral-900">총 결제금액</span>
                          <span className="text-xl font-bold text-primary-600">
                            {formatPrice(order.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 주문 메모 */}
                    {order.notes && (
                      <div className="border-t border-neutral-200 pt-4">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">배송 메모</h4>
                        <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                          {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
