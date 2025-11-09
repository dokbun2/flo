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
import { useAdminOrders } from "@/contexts/AdminOrderContext";
import { Search, CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isWithinInterval, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

export default function OrderManagementPage() {
  const { orders, updateOrderFiles, updateOrder, deleteOrder, loading } = useAdminOrders();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
  const [confirmationDoc, setConfirmationDoc] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // 수정용 상태
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editTotalPrice, setEditTotalPrice] = useState("");

  const handleOpenDialog = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setEditCustomerName(order.customerName);
    setEditPhone(order.phone);
    setEditAddress(order.address);
    setEditTotalPrice(order.totalPrice.toString());
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrder(selectedOrder.id, {
        customerName: editCustomerName,
        phone: editPhone,
        address: editAddress,
        totalPrice: parseInt(editTotalPrice),
      });
      setOpenEditDialog(false);
      alert("주문 정보가 수정되었습니다.");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("주문 수정에 실패했습니다.");
    }
  };

  const handleDeleteOrder = async (orderId: string, customerName: string) => {
    if (!confirm(`${customerName}님의 주문을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await deleteOrder(orderId);
      alert("주문이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("주문 삭제에 실패했습니다.");
    }
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

  const formatOrderId = (id: string) => {
    // UUID의 처음 8자만 표시
    return id.substring(0, 8).toUpperCase();
  };

  // 검색 및 날짜 필터링
  const filteredOrders = orders.filter((order) => {
    // 검색어 필터링
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());

    // 날짜 필터링
    let matchesDate = true;
    if (dateRange?.from) {
      const orderDate = parseISO(order.orderDate);
      if (dateRange.to) {
        matchesDate = isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to });
      } else {
        matchesDate = orderDate >= dateRange.from;
      }
    }

    return matchesSearch && matchesDate;
  });

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="px-1">
        <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">주문 접수 현황</h1>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-white rounded-lg shadow p-2 sm:p-3">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Label htmlFor="search" className="text-xs font-semibold whitespace-nowrap">
              주문 검색
            </Label>
            <div className="relative w-full sm:flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="고객명, 전화번호, 주문번호, 상품명"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 sm:h-8 text-xs w-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Label className="text-xs font-semibold whitespace-nowrap">
              기간 검색
            </Label>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 sm:h-8 text-xs justify-start text-left font-normal w-full sm:w-[240px]"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "yy-MM-dd")} - {format(dateRange.to, "yy-MM-dd")}
                          </>
                        ) : (
                          format(dateRange.from, "yy-MM-dd")
                        )
                      ) : (
                        "날짜 선택"
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateRange && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDateRange(undefined)}
                  className="h-9 sm:h-8 text-xs whitespace-nowrap"
                >
                  초기화
                </Button>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-600 pt-1 border-t border-gray-100">
            검색 결과: <span className="font-semibold text-primary-600">{filteredOrders.length}</span>건
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible scrollbar-visible -mx-2 sm:mx-0">
          <Table className="text-xs w-full border-collapse min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-left w-[80px] sm:w-[100px] font-semibold">주문번호</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-left w-[80px] sm:w-[100px] font-semibold">주문일자</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-left w-[70px] sm:w-[90px] font-semibold">고객명</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-left w-[110px] sm:w-[130px] font-semibold">전화번호</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-left w-[140px] sm:w-[160px] font-semibold">제품명</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-center w-[50px] sm:w-[60px] font-semibold">수량</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-right w-[90px] sm:w-[100px] font-semibold">총금액</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-left font-semibold">배송주소</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-center w-[70px] sm:w-[80px] font-semibold">배송현황</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-center w-[80px] sm:w-[90px] font-semibold">배송완료일</TableHead>
                <TableHead className="text-xs px-2 sm:px-3 py-2 sm:py-3 text-center w-[130px] sm:w-[150px] font-semibold">관리</TableHead>
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
                <TableRow key={order.id} className="border-t hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-xs px-2 sm:px-3 py-2 sm:py-3" title={order.id}>
                    <span className="text-gray-700">{formatOrderId(order.id)}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs px-2 sm:px-3 py-2 sm:py-3 text-gray-600">
                    {order.orderDate}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs px-2 sm:px-3 py-2 sm:py-3 text-gray-700">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs px-2 sm:px-3 py-2 sm:py-3 text-gray-600">
                    {order.phone}
                  </TableCell>
                  <TableCell className="text-xs px-2 sm:px-3 py-2 sm:py-3">
                    <div className="truncate font-medium text-gray-900" title={order.productName}>
                      {order.productName}
                    </div>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap text-xs px-2 sm:px-3 py-2 sm:py-3 text-gray-700">
                    {order.quantity}개
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap text-xs px-2 sm:px-3 py-2 sm:py-3 text-gray-900">
                    {formatPrice(order.totalPrice)}
                  </TableCell>
                  <TableCell className="text-xs px-2 sm:px-3 py-2 sm:py-3">
                    <div className="truncate text-gray-600" title={order.address}>
                      {order.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap text-xs px-2 sm:px-3 py-2 sm:py-3">
                    <span className="text-gray-700 font-medium">{order.status}</span>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap text-xs px-2 sm:px-3 py-2 sm:py-3 text-gray-600">
                    {order.deliveryDate ? format(new Date(order.deliveryDate), "yy-MM-dd") : "-"}
                  </TableCell>
                  <TableCell className="text-center px-2 sm:px-3 py-2 sm:py-3">
                    <div className="flex justify-center gap-0.5 sm:gap-1">
                      {/* 배송 관리 버튼 */}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleOpenDialog(order);
                              setDeliveryDate(order.deliveryDate ? new Date(order.deliveryDate) : undefined);
                            }}
                            className="whitespace-nowrap text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2 hover:bg-primary-50 hover:border-primary-300 touch-manipulation"
                          >
                            배송
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] p-4">
                          <DialogHeader className="mb-2">
                            <DialogTitle className="text-sm">{selectedOrder?.id ? formatOrderId(selectedOrder.id) : ''} - {selectedOrder?.customerName}</DialogTitle>
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

                      {/* 수정 버튼 */}
                      <Dialog open={openEditDialog && selectedOrder?.id === order.id} onOpenChange={(open) => {
                        if (!open) {
                          setOpenEditDialog(false);
                          setSelectedOrder(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(order)}
                            className="text-xs h-6 sm:h-7 px-1.5 sm:px-2 hover:bg-blue-50 hover:border-blue-300 touch-manipulation"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] p-4">
                          <DialogHeader className="mb-2">
                            <DialogTitle className="text-sm">주문 정보 수정</DialogTitle>
                            <DialogDescription className="text-xs">
                              주문 정보를 수정합니다. 수정 후 저장 버튼을 눌러주세요.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-3 py-2">
                            <div className="space-y-1">
                              <Label htmlFor="edit-customer-name" className="text-xs">고객명</Label>
                              <Input
                                id="edit-customer-name"
                                value={editCustomerName}
                                onChange={(e) => setEditCustomerName(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="edit-phone" className="text-xs">전화번호</Label>
                              <Input
                                id="edit-phone"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="edit-address" className="text-xs">배송주소</Label>
                              <Input
                                id="edit-address"
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="edit-total-price" className="text-xs">총금액</Label>
                              <Input
                                id="edit-total-price"
                                type="number"
                                value={editTotalPrice}
                                onChange={(e) => setEditTotalPrice(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button variant="outline" size="sm" onClick={() => setOpenEditDialog(false)} className="text-xs h-7">
                                취소
                              </Button>
                              <Button size="sm" onClick={handleSaveEdit} className="text-xs h-7">저장</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* 삭제 버튼 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id, order.customerName)}
                        className="text-xs h-6 sm:h-7 px-1.5 sm:px-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 touch-manipulation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
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
