"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Search, ExternalLink } from "lucide-react";
import { useProducts, type Product } from "@/contexts/ProductContext";
import Link from "next/link";

export default function ProductStatusPage() {
  const { products, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterStatus, setFilterStatus] = useState("전체");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // 이미지 파일 상태
  const [thumbnails, setThumbnails] = useState<{
    thumbnail1: File | null;
    thumbnail2: File | null;
    thumbnail3: File | null;
  }>({
    thumbnail1: null,
    thumbnail2: null,
    thumbnail3: null,
  });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [commonImage, setCommonImage] = useState<File | null>(null);

  const categories = ["전체", "축하화환", "근조화환", "꽃다발", "관엽식물", "개업축하"];
  const statuses = ["전체", "판매중", "품절", "판매중지"];

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "전체" || product.category === filterCategory;
    const matchesStatus = filterStatus === "전체" || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setThumbnails({ thumbnail1: null, thumbnail2: null, thumbnail3: null });
    setEventImage(null);
    setCommonImage(null);
    setOpenDialog(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    // 이미지 파일을 URL로 변환
    const updatedProduct = { ...editingProduct };

    if (thumbnails.thumbnail1) {
      updatedProduct.thumbnails = {
        ...updatedProduct.thumbnails,
        thumbnail1: URL.createObjectURL(thumbnails.thumbnail1),
      };
    }
    if (thumbnails.thumbnail2) {
      updatedProduct.thumbnails = {
        ...updatedProduct.thumbnails,
        thumbnail2: URL.createObjectURL(thumbnails.thumbnail2),
      };
    }
    if (thumbnails.thumbnail3) {
      updatedProduct.thumbnails = {
        ...updatedProduct.thumbnails,
        thumbnail3: URL.createObjectURL(thumbnails.thumbnail3),
      };
    }
    if (eventImage) {
      updatedProduct.eventImage = URL.createObjectURL(eventImage);
    }
    if (commonImage) {
      updatedProduct.commonImage = URL.createObjectURL(commonImage);
    }

    updateProduct(editingProduct.id, updatedProduct);
    setOpenDialog(false);
    setEditingProduct(null);
    setThumbnails({ thumbnail1: null, thumbnail2: null, thumbnail3: null });
    setEventImage(null);
    setCommonImage(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
      deleteProduct(productId);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("ko-KR")}원`;
  };

  const getStatusBadge = (status: Product["status"]) => {
    const colors = {
      판매중: "bg-green-100 text-green-800",
      품절: "bg-red-100 text-red-800",
      판매중지: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-gray-900">상품 현황</h1>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* 검색 */}
          <div className="md:col-span-2">
            <Label htmlFor="search" className="text-xs">검색</Label>
            <div className="relative mt-0.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="상품명/번호"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-7 text-xs"
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div>
            <Label className="text-xs">카테고리</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="mt-0.5 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-xs">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 상태 필터 */}
          <div>
            <Label className="text-xs">상태</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="mt-0.5 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status} className="text-xs">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-600">
          총 <span className="font-semibold text-primary-600">{filteredProducts.length}</span>개
        </div>
      </div>

      {/* 상품 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto scrollbar-visible">
          <Table className="text-xs w-full table-fixed border-collapse">
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="w-12 text-xs px-2 py-1 text-left">번호</TableHead>
                <TableHead className="w-20 text-xs px-2 py-1 text-left">등록일</TableHead>
                <TableHead className="flex-1 text-xs px-2 py-1 text-left">상품명</TableHead>
                <TableHead className="w-16 text-xs px-2 py-1 text-left">카테고리</TableHead>
                <TableHead className="w-20 text-xs px-2 py-1 text-right">가격</TableHead>
                <TableHead className="w-12 text-xs px-2 py-1 text-center">재고</TableHead>
                <TableHead className="w-16 text-xs px-2 py-1 text-center">상태</TableHead>
                <TableHead className="w-16 text-xs px-2 py-1 text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500 text-xs">
                    검색 결과 없음
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="h-8 border-t">
                    <TableCell className="font-medium text-xs px-2 py-1 whitespace-nowrap">{product.id}</TableCell>
                    <TableCell className="text-xs px-2 py-1 whitespace-nowrap">{product.registeredDate}</TableCell>
                    <TableCell className="text-xs px-2 py-1 overflow-hidden">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="text-primary-600 hover:underline block truncate"
                      >
                        {product.productName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs px-2 py-1 whitespace-nowrap">{product.category}</TableCell>
                    <TableCell className="text-right text-xs px-2 py-1 whitespace-nowrap">{formatPrice(product.price)}</TableCell>
                    <TableCell className="text-center text-xs px-2 py-1 whitespace-nowrap">
                      <span
                        className={
                          product.quantity === 0
                            ? "text-red-600 font-semibold"
                            : product.quantity < 5
                            ? "text-orange-600 font-semibold"
                            : ""
                        }
                      >
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-xs px-2 py-1 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell className="text-center px-2 py-1">
                      <div className="flex items-center justify-center gap-0.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 flex-shrink-0"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 flex-shrink-0"
                          onClick={() => handleDeleteProduct(product.id)}
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

      {/* 수정 다이얼로그 */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-3">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-sm">상품 정보 수정</DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="grid gap-2 py-2">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="edit-name" className="text-xs">상품명 *</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.productName}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, productName: e.target.value })
                    }
                    className="mt-0.5 h-7 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category" className="text-xs">카테고리 *</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) =>
                      setEditingProduct({ ...editingProduct, category: value })
                    }
                  >
                    <SelectTrigger id="edit-category" className="mt-0.5 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "전체").map((category) => (
                        <SelectItem key={category} value={category} className="text-xs">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="edit-price" className="text-xs">가격 *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-0.5 h-7 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-quantity" className="text-xs">재고 *</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-0.5 h-7 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-status" className="text-xs">상태 *</Label>
                <Select
                  value={editingProduct.status}
                  onValueChange={(value: Product["status"]) =>
                    setEditingProduct({ ...editingProduct, status: value })
                  }
                >
                  <SelectTrigger id="edit-status" className="mt-0.5 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="판매중" className="text-xs">판매중</SelectItem>
                    <SelectItem value="품절" className="text-xs">품절</SelectItem>
                    <SelectItem value="판매중지" className="text-xs">판매중지</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-xs">설명 *</Label>
                <Textarea
                  id="edit-description"
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="mt-0.5 text-xs"
                />
              </div>

              {/* 썸네일 업로드 */}
              <div>
                <h3 className="text-xs font-medium text-gray-900 mb-2">이미지</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="edit-thumbnail1" className="text-xs">썸네일 1</Label>
                    <Input
                      id="edit-thumbnail1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnails({
                        ...thumbnails,
                        thumbnail1: e.target.files?.[0] || null
                      })}
                      className="mt-1"
                    />
                    {(thumbnails.thumbnail1 || editingProduct.thumbnails?.thumbnail1) && (
                      <p className="text-xs text-green-600 mt-1">
                        {thumbnails.thumbnail1 ? `✓ ${thumbnails.thumbnail1.name}` : "✓ 등록됨"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="edit-thumbnail2" className="text-xs">썸네일 2</Label>
                    <Input
                      id="edit-thumbnail2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnails({
                        ...thumbnails,
                        thumbnail2: e.target.files?.[0] || null
                      })}
                      className="mt-1"
                    />
                    {(thumbnails.thumbnail2 || editingProduct.thumbnails?.thumbnail2) && (
                      <p className="text-xs text-green-600 mt-1">
                        {thumbnails.thumbnail2 ? `✓ ${thumbnails.thumbnail2.name}` : "✓ 등록됨"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="edit-thumbnail3" className="text-xs">썸네일 3</Label>
                    <Input
                      id="edit-thumbnail3"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnails({
                        ...thumbnails,
                        thumbnail3: e.target.files?.[0] || null
                      })}
                      className="mt-1"
                    />
                    {(thumbnails.thumbnail3 || editingProduct.thumbnails?.thumbnail3) && (
                      <p className="text-xs text-green-600 mt-1">
                        {thumbnails.thumbnail3 ? `✓ ${thumbnails.thumbnail3.name}` : "✓ 등록됨"}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다
                </p>
              </div>

              {/* 상세페이지 내용 */}
              <div>
                <Label htmlFor="edit-detail-content">상세페이지 내용</Label>
                <Textarea
                  id="edit-detail-content"
                  rows={6}
                  value={editingProduct.detailContent || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, detailContent: e.target.value })
                  }
                  placeholder="상품 상세 설명을 입력하세요."
                  className="mt-1 font-mono text-sm"
                />
              </div>

              {/* 이벤트 이미지 */}
              <div>
                <Label htmlFor="edit-event-image">이벤트 이미지</Label>
                <Input
                  id="edit-event-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventImage(e.target.files?.[0] || null)}
                  className="mt-1"
                />
                {(eventImage || editingProduct.eventImage) && (
                  <p className="text-sm text-green-600 mt-1">
                    {eventImage ? `✓ ${eventImage.name}` : "✓ 등록됨"}
                  </p>
                )}
              </div>

              {/* 공통 이미지 */}
              <div>
                <Label htmlFor="edit-common-image">공통 이미지 (배송안내 등)</Label>
                <Input
                  id="edit-common-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCommonImage(e.target.files?.[0] || null)}
                  className="mt-1"
                />
                {(commonImage || editingProduct.commonImage) && (
                  <p className="text-sm text-green-600 mt-1">
                    {commonImage ? `✓ ${commonImage.name}` : "✓ 등록됨"}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setOpenDialog(false)} className="text-xs h-7">
                  취소
                </Button>
                <Button size="sm" onClick={handleSaveProduct} className="text-xs h-7">저장</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
