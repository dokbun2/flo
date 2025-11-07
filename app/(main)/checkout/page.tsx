"use client";

import { useState } from "react";
import { AddressInput } from "@/components/AddressInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShippingInfo {
  recipientName: string;
  phoneNumber: string;
  zonecode: string;
  address: string;
  detailAddress: string;
}

export default function CheckoutPage() {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    recipientName: "",
    phoneNumber: "",
    zonecode: "",
    address: "",
    detailAddress: "",
  });

  const handleAddressChange = (addressData: {
    zonecode: string;
    address: string;
    detailAddress: string;
  }) => {
    setShippingInfo({
      ...shippingInfo,
      ...addressData,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shippingInfo.recipientName ||
      !shippingInfo.phoneNumber ||
      !shippingInfo.zonecode ||
      !shippingInfo.address ||
      !shippingInfo.detailAddress
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    console.log("배송 정보:", shippingInfo);
    alert("배송 주소가 저장되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">배송 정보</h1>
          <p className="text-gray-600 mb-8">
            배송을 받으실 주소를 입력해주세요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 수령인 정보 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                수령인 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient-name">받으실 분 이름</Label>
                  <Input
                    id="recipient-name"
                    type="text"
                    value={shippingInfo.recipientName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        recipientName: e.target.value,
                      })
                    }
                    placeholder="홍길동"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phoneNumber}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="010-1234-5678"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* 주소 입력 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                배송 주소
              </h2>
              <AddressInput onAddressChange={handleAddressChange} />
            </div>

            {/* 주소 미리보기 */}
            {shippingInfo.address && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  입력된 주소:
                </p>
                <p className="text-gray-900">
                  [{shippingInfo.zonecode}] {shippingInfo.address}{" "}
                  {shippingInfo.detailAddress}
                </p>
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setShippingInfo({
                    recipientName: "",
                    phoneNumber: "",
                    zonecode: "",
                    address: "",
                    detailAddress: "",
                  })
                }
              >
                초기화
              </Button>
              <Button type="submit" className="flex-1">
                배송 정보 저장
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
