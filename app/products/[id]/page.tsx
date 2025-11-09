"use client";

import { use } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useOrders } from "@/contexts/OrderContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressInput } from "@/components/AddressInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products } = useProducts();
  const { addOrder } = useOrders();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // 주문 모달 상태
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          상품을 찾을 수 없습니다
        </h1>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const images = [
    product.thumbnails?.thumbnail1,
    product.thumbnails?.thumbnail2,
    product.thumbnails?.thumbnail3,
  ].filter(Boolean) as string[];

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const shippingFee = 5000; // 배송비 고정
  const totalPrice = product.price * quantity + shippingFee;

  const handlePurchase = () => {
    if (product.quantity === 0) {
      alert("품절된 상품입니다.");
      return;
    }
    setOrderDialogOpen(true);
  };

  const handleAddressChange = (addressData: {
    zonecode: string;
    address: string;
    detailAddress: string;
  }) => {
    setZonecode(addressData.zonecode);
    setAddress(addressData.address);
    setDetailAddress(addressData.detailAddress);
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (product.quantity === 0) {
      alert("품절된 상품입니다.");
      return;
    }

    try {
      await addToCart(
        {
          id: product.id,
          title: product.productName,
          price: product.price,
          imageUrl: product.thumbnails?.thumbnail1 || "/placeholder-product.svg",
        },
        quantity
      );
      alert("장바구니에 추가되었습니다!");
    } catch (error) {
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address || !detailAddress) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const fullAddress = `[${zonecode}] ${address} ${detailAddress}`;

    // 주문 추가
    addOrder({
      customerName,
      phone,
      address: fullAddress,
      productId: product.id,
      productName: product.productName,
      category: product.category,
      productPrice: product.price,
      quantity,
      totalPrice,
      shippingFee,
    });

    alert("주문이 완료되었습니다!");
    setOrderDialogOpen(false);
    setCustomerName("");
    setPhone("");
    setZonecode("");
    setAddress("");
    setDetailAddress("");
    setQuantity(1);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            홈
          </Link>
          <span>/</span>
          <span className="text-gray-400">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.productName}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              <Image
                src={images[selectedImage] || "/placeholder-product.svg"}
                alt={product.productName}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.productName} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-block">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Price */}
            <div className="border-y border-gray-200 py-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">재고:</span>
              {product.quantity > 0 ? (
                <span className="text-sm font-medium text-green-600">
                  {product.quantity}개 남음
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600">품절</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  수량
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.quantity}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-sm text-gray-600">총 금액</span>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg"
                  disabled={product.quantity === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  장바구니
                </Button>
                <Button
                  size="lg"
                  className="text-lg bg-primary-600 hover:bg-primary-700"
                  disabled={product.quantity === 0}
                  onClick={handlePurchase}
                >
                  구매하기
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  찜하기
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5 mr-2" />
                  공유하기
                </Button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-200 pt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">상품번호:</span>
                <span className="text-gray-900">{product.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">등록일:</span>
                <span className="text-gray-900">{product.registeredDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Detail Content */}
        {product.detailContent && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">상세 정보</h2>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {product.detailContent}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Event Image */}
        {product.eventImage && (
          <div className="mt-8">
            <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden">
              <Image
                src={product.eventImage}
                alt="이벤트 이미지"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Common Image (Shipping Info) */}
        {product.commonImage && (
          <div className="mt-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              배송 안내
            </h2>
            <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden">
              <Image
                src={product.commonImage}
                alt="배송 안내"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>

      {/* 주문 접수 모달 */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">주문하기</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleOrderSubmit} className="flex flex-col overflow-hidden">
            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4 scrollbar-visible">
              {/* 상품 내역 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">주문 상품</h3>
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  {/* 상품 이미지 */}
                  {images.length > 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden relative">
                        <Image
                          src={images[0]}
                          alt={product.productName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 space-y-2 text-sm">
                    <p className="font-medium text-gray-900">{product.productName}</p>
                    <p className="text-gray-600">{product.category}</p>
                    <p className="text-gray-600">수량: {quantity}개</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 배송비 및 총액 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                  <span>총 결제 금액</span>
                  <span className="text-primary-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* 배송 정보 입력 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">배송 정보</h3>

                <div>
                  <Label htmlFor="customer-name" className="text-sm">
                    고객명 *
                  </Label>
                  <Input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="홍길동"
                    className="mt-1 text-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm">
                    전화번호 *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="mt-1 text-sm"
                    required
                  />
                </div>

                <div>
                  <AddressInput onAddressChange={handleAddressChange} />
                </div>
              </div>
            </div>

            {/* 버튼 영역 - 항상 아래에 고정 */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-white">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOrderDialogOpen(false)}
                size="sm"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700"
                size="sm"
              >
                결제하기
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
