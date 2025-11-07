"use client";

import { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface AddressData {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
}

interface AddressInputProps {
  onAddressChange?: (data: {
    zonecode: string;
    address: string;
    detailAddress: string;
  }) => void;
}

export function AddressInput({ onAddressChange }: AddressInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const handleAddressSelect = (data: AddressData) => {
    const selectedAddress = data.roadAddress || data.jibunAddress;
    setZonecode(data.zonecode);
    setAddress(selectedAddress);
    setDetailAddress("");
    setIsOpen(false);

    onAddressChange?.({
      zonecode: data.zonecode,
      address: selectedAddress,
      detailAddress: "",
    });
  };

  const handleDetailAddressChange = (value: string) => {
    setDetailAddress(value);
    onAddressChange?.({
      zonecode,
      address,
      detailAddress: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="postcode">우편번호</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="postcode"
            type="text"
            value={zonecode}
            readOnly
            placeholder="우편번호"
            className="flex-1 bg-gray-100"
          />
          <Button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            주소검색
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">주소 검색</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
              <DaumPostcode onComplete={handleAddressSelect} />
            </div>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="address">기본주소</Label>
        <Input
          id="address"
          type="text"
          value={address}
          readOnly
          placeholder="기본주소"
          className="mt-1 bg-gray-100"
        />
      </div>

      <div>
        <Label htmlFor="detail-address">상세주소</Label>
        <Input
          id="detail-address"
          type="text"
          value={detailAddress}
          onChange={(e) => handleDetailAddressChange(e.target.value)}
          placeholder="상세주소를 입력하세요 (예: 101동 1001호)"
          className="mt-1"
        />
      </div>
    </div>
  );
}
