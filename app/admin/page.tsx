"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrders } from "@/contexts/OrderContext";
import { Search, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function OrderManagementPage() {
  const { orders, updateOrderFiles } = useOrders();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
  const [confirmationDoc, setConfirmationDoc] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);

  const handleOpenDialog = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleSaveDeliveryStatus = () => {
    if (!selectedOrder) return;

    // 실제 구현 시 파일 업로드 후 URL 저장
    const files: { deliveryPhoto?: string; confirmationDoc?: string; deliveryDate?: string } = {};
    if (deliveryPhoto) {
      files.deliveryPhoto = URL.createObjectURL(deliveryPhoto);
    }
    if (confirmationDoc) {
      files.confirmationDoc = URL.createObjectURL(confirmationDoc);
    }
    if (deliveryDate) {
      files.deliveryDate = format(deliveryDate, "yyyy-MM-dd");
    }

    updateOrderFiles(selectedOrder.id, files);
    setOpenDialog(false);
    setDeliveryPhoto(null);
    setConfirmationDoc(null);
    setDeliveryDate(undefined);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("ko-KR")}원`;
  };

  // 검색 필터링
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-2">
      <div className="px-1">
        <h1 className="text-base md:text-lg font-bold text-gray-900">주문 접수 현황</h1>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-white rounded-lg shadow p-2">
        <div className="flex items-center gap-3">
          <Label htmlFor="search" className="text-xs font-semibold whitespace-nowrap">
            주문 검색
          </Label>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="고객명, 전화번호, 주문번호, 상품명"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-8 text-xs"
            />
          </div>
          <span className="text-xs text-gray-600 whitespace-nowrap">
            검색 결과: <span className="font-semibold text-primary-600">{filteredOrders.length}</span>건
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible scrollbar-visible">
          <Table className="text-xs w-full table-fixed border-collapse">
            <TableHeader>
              <TableRow className="h-7">
                <TableHead className="w-20 text-xs px-1.5 py-1 text-left">주문번호</TableHead>
                <TableHead className="w-20 text-xs px-1.5 py-1 text-left">주문일자</TableHead>
                <TableHead className="w-16 text-xs px-1.5 py-1 text-left">고객명</TableHead>
                <TableHead className="w-24 text-xs px-1.5 py-1 text-left">전화번호</TableHead>
                <TableHead className="w-24 text-xs px-1.5 py-1 text-left">제품명</TableHead>
                <TableHead className="w-12 text-xs px-1.5 py-1 text-center">수량</TableHead>
                <TableHead className="w-20 text-xs px-1.5 py-1 text-right">총금액</TableHead>
                <TableHead className="flex-1 text-xs px-1.5 py-1 text-left">배송주소</TableHead>
                <TableHead className="w-16 text-xs px-1.5 py-1 text-center">배송현황</TableHead>
                <TableHead className="w-20 text-xs px-1.5 py-1 text-center">배송완료일</TableHead>
                <TableHead className="w-16 text-xs px-1.5 py-1 text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-3 text-gray-500 text-xs">
                    검색 결과 없음
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                <TableRow key={order.id} className="h-7 border-t">
                  <TableCell className="font-medium whitespace-nowrap text-xs px-1.5 py-0.5">{order.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs px-1.5 py-0.5">{order.orderDate}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs px-1.5 py-0.5">{order.customerName}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs px-1.5 py-0.5">{order.phone}</TableCell>
                  <TableCell className="text-xs px-1.5 py-0.5 overflow-hidden">
                    <p className="truncate font-medium">{order.productName}</p>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap text-xs px-1.5 py-0.5">{order.quantity}개</TableCell>
                  <TableCell className="text-right font-semibold whitespace-nowrap text-xs px-1.5 py-0.5">
                    {formatPrice(order.totalPrice)}
                  </TableCell>
                  <TableCell className="text-xs px-1.5 py-0.5 overflow-hidden">
                    <p className="truncate" title={order.address}>{order.address}</p>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap text-xs px-1.5 py-0.5">
                    {order.status}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap text-xs px-1.5 py-0.5">
                    {order.deliveryDate ? format(new Date(order.deliveryDate), "yy-MM-dd") : "-"}
                  </TableCell>
                  <TableCell className="text-center px-1.5 py-0.5">
                    <Dialog
                      open={openDialog && selectedOrder?.id === order.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setOpenDialog(false);
                          setSelectedOrder(null);
                          setDeliveryDate(undefined);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => {
                          handleOpenDialog(order);
                          setDeliveryDate(order.deliveryDate ? new Date(order.deliveryDate) : undefined);
                        }} className="whitespace-nowrap text-xs h-6 px-2">
                          관리
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[450px] p-4">
                        <DialogHeader className="mb-2">
                          <DialogTitle className="text-sm">{selectedOrder?.id} - {selectedOrder?.customerName}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3 py-2">
                          {/* 주문 정보 요약 */}
                          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">상품명</span>
                              <span className="font-medium truncate ml-2">{selectedOrder?.productName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">배송주소</span>
                              <span className="font-medium text-right max-w-xs truncate ml-2">{selectedOrder?.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">총금액</span>
                              <span className="font-semibold">{formatPrice(selectedOrder?.totalPrice || 0)}</span>
                            </div>
                          </div>

                          {/* 배송완료일 선택 */}
                          <div className="space-y-1">
                            <Label className="text-xs">배송완료일</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start text-left font-normal text-xs h-8"
                                >
                                  <CalendarIcon className="mr-2 h-3 w-3" />
                                  {deliveryDate
                                    ? format(deliveryDate, "yyyy-MM-dd")
                                    : "날짜 선택"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={deliveryDate}
                                  onSelect={setDeliveryDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="delivery-photo" className="text-xs">배송 완료 사진</Label>
                            <Input
                              id="delivery-photo"
                              type="file"
                              accept="image/*"
                              onChange={(e) => setDeliveryPhoto(e.target.files?.[0] || null)}
                              className="h-7 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="confirmation-doc" className="text-xs">인수 확인서</Label>
                            <Input
                              id="confirmation-doc"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => setConfirmationDoc(e.target.files?.[0] || null)}
                              className="h-7 text-xs"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => setOpenDialog(false)} className="text-xs h-7">
                              취소
                            </Button>
                            <Button size="sm" onClick={handleSaveDeliveryStatus} className="text-xs h-7">저장</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

