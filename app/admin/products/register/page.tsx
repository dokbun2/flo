"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileSpreadsheet, Download, Trash2, Check } from "lucide-react";
import * as XLSX from "xlsx";
import { useProducts } from "@/contexts/ProductContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExcelProduct {
  productName: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
}

const SAMPLE_PRODUCTS: ExcelProduct[] = [
  {
    productName: "프리미엄 축하화환 A",
    category: "축하화환",
    price: 150000,
    quantity: 10,
    description: "고급 장미와 카네이션으로 만든 프리미엄 축하화환",
  },
  {
    productName: "로즈 꽃다발 50송이",
    category: "꽃다발",
    price: 80000,
    quantity: 20,
    description: "신선한 빨간 장미 50송이 꽃다발",
  },
  {
    productName: "몬스테라 대형",
    category: "관엽식물",
    price: 65000,
    quantity: 15,
    description: "공기정화 기능이 있는 몬스테라 대형",
  },
];

const categories = ["축하화환", "근조화환", "꽃다발", "관엽식물", "개업축하", "승진/취임", "결혼/장례", "플랜테리어"];

export default function ProductRegistrationPage() {
  const { addProduct } = useProducts();

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<ExcelProduct[]>([]);
  const [registeredProducts, setRegisteredProducts] = useState<string[]>([]);

  // 개별 등록 폼 상태
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnails, setThumbnails] = useState<{
    thumbnail1: File | null;
    thumbnail2: File | null;
    thumbnail3: File | null;
  }>({
    thumbnail1: null,
    thumbnail2: null,
    thumbnail3: null,
  });
  const [detailContent, setDetailContent] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [commonImage, setCommonImage] = useState<File | null>(null);

  // 예시 엑셀 파일 다운로드
  const downloadSampleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_PRODUCTS);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "상품목록");

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 40 },
    ];

    XLSX.writeFile(workbook, "상품_예시_템플릿.xlsx");
  };

  const handleExcelUpload = () => {
    if (!excelFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<ExcelProduct>(worksheet);

        const validProducts = jsonData.filter(
          (item) =>
            item.productName &&
            item.category &&
            item.price &&
            item.quantity &&
            item.description
        );

        if (validProducts.length === 0) {
          alert("유효한 상품 데이터가 없습니다. 양식을 확인해주세요.");
          return;
        }

        setParsedProducts(validProducts);
        alert(`${validProducts.length}개의 상품이 파싱되었습니다.`);
      } catch (error) {
        alert("엑셀 파일 읽기에 실패했습니다.");
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const handleRegisterProducts = () => {
    if (parsedProducts.length === 0) {
      alert("등록할 상품이 없습니다.");
      return;
    }

    parsedProducts.forEach((product) => {
      addProduct({
        productName: product.productName,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        status: "판매중",
      });
    });

    setRegisteredProducts(parsedProducts.map((p) => p.productName));
    alert(`${parsedProducts.length}개의 상품이 등록되었습니다.`);
    setParsedProducts([]);
    setExcelFile(null);
  };

  const handleRemoveProduct = (index: number) => {
    const updated = parsedProducts.filter((_, i) => i !== index);
    setParsedProducts(updated);
  };

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!productName || !category || !price || !quantity || !description) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 이미지 파일을 URL로 변환 (실제로는 서버 업로드 후 URL 받아옴)
    const getThumbnailUrls = () => {
      const urls: { thumbnail1?: string; thumbnail2?: string; thumbnail3?: string } = {};
      if (thumbnails.thumbnail1) {
        urls.thumbnail1 = URL.createObjectURL(thumbnails.thumbnail1);
      }
      if (thumbnails.thumbnail2) {
        urls.thumbnail2 = URL.createObjectURL(thumbnails.thumbnail2);
      }
      if (thumbnails.thumbnail3) {
        urls.thumbnail3 = URL.createObjectURL(thumbnails.thumbnail3);
      }
      return urls;
    };

    addProduct({
      productName,
      category,
      price: parseInt(price),
      quantity: parseInt(quantity),
      description,
      status: "판매중",
      thumbnails: getThumbnailUrls(),
      detailContent,
      eventImage: eventImage ? URL.createObjectURL(eventImage) : undefined,
      commonImage: commonImage ? URL.createObjectURL(commonImage) : undefined,
    });

    alert("상품이 등록되었습니다.");

    // 폼 초기화
    setProductName("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setDescription("");
    setThumbnails({ thumbnail1: null, thumbnail2: null, thumbnail3: null });
    setDetailContent("");
    setEventImage(null);
    setCommonImage(null);
  };

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-gray-900">신규 상품 등록</h1>
      </div>

      {/* 엑셀 일괄 업로드 섹션 */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex items-center gap-2 mb-3">
          <FileSpreadsheet className="w-4 h-4 text-green-600 flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-900">엑셀 일괄 업로드</h2>
        </div>

        <div className="space-y-2 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900 mb-2">
              📋 예시 템플릿을 다운로드해 작성해주세요.
            </p>
            <Button
              onClick={downloadSampleExcel}
              variant="outline"
              size="sm"
              className="text-xs h-7 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Download className="w-3 h-3" />
              템플릿 다운로드
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <div className="flex-1 min-w-0">
              <Label htmlFor="excel-file" className="text-xs">엑셀 파일 선택</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                className="mt-0.5 h-7 text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                {excelFile ? `선택: ${excelFile.name}` : ".xlsx, .xls, .csv"}
              </p>
            </div>
            <Button
              onClick={handleExcelUpload}
              disabled={!excelFile}
              size="sm"
              className="text-xs h-7 flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
            >
              <Upload className="w-3 h-3" />
              파싱
            </Button>
          </div>
        </div>

        {/* 파싱된 상품 목록 */}
        {parsedProducts.length > 0 && (
          <div className="space-y-2 border-t pt-2">
            <h3 className="text-xs font-semibold text-gray-900">
              파싱된 상품 ({parsedProducts.length}개)
            </h3>

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {parsedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.productName}</p>
                      <p className="text-gray-600 truncate">
                        {product.category} • ₩{product.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="ml-2 p-1 hover:bg-red-100 rounded text-red-600 flex-shrink-0"
                      aria-label="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
              ))}
            </div>

            <Button
              onClick={handleRegisterProducts}
              size="sm"
              className="w-full mt-2 text-xs h-7 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-3 h-3 mr-1" />
              일괄 등록 ({parsedProducts.length}개)
            </Button>
          </div>
        )}

        {/* 등록 완료 상품 */}
        {registeredProducts.length > 0 && (
          <div className="border-t pt-2 mt-2">
            <h3 className="text-xs font-semibold text-green-600 mb-2">
              ✓ 등록완료 ({registeredProducts.length}개)
            </h3>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {registeredProducts.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1 bg-green-50 text-xs rounded"
                >
                  <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <span className="text-gray-900 truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 개별 등록 폼 */}
      <form onSubmit={handleIndividualSubmit} className="bg-white rounded-lg shadow p-3">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">개별 상품 등록</h2>

        <div className="space-y-3">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="product-name" className="text-xs">상품명 *</Label>
              <Input
                id="product-name"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="상품명"
                className="mt-0.5 h-7 text-xs"
                required
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-xs">카테고리 *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="mt-0.5 h-7 text-xs">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="price" className="text-xs">가격 (원) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                className="mt-0.5 h-7 text-xs"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-xs">재고 수량 *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="10"
                className="mt-0.5 h-7 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-xs">상품 설명 *</Label>
            <Textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="설명"
              className="mt-0.5 text-xs"
              required
            />
          </div>

          {/* 썸네일 업로드 */}
          <div>
            <h3 className="text-xs font-medium text-gray-900 mb-2">상품 이미지</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Label htmlFor={`thumbnail${i}`} className="text-xs">
                    이미지 {i}
                  </Label>
                  <Input
                    id={`thumbnail${i}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnails({
                      ...thumbnails,
                      [`thumbnail${i}` as keyof typeof thumbnails]: e.target.files?.[0] || null
                    })}
                    className="mt-0.5 h-7 text-xs"
                  />
                  {thumbnails[`thumbnail${i}` as keyof typeof thumbnails] && (
                    <p className="text-xs text-green-600 mt-0.5">✓</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 상세페이지 내용 */}
          <div>
            <Label htmlFor="detail-content" className="text-xs">상세 내용</Label>
            <Textarea
              id="detail-content"
              rows={5}
              value={detailContent}
              onChange={(e) => setDetailContent(e.target.value)}
              placeholder="상세 설명"
              className="mt-0.5 text-xs"
            />
          </div>

          {/* 이벤트 이미지 */}
          <div>
            <Label htmlFor="event-image" className="text-xs">이벤트 이미지</Label>
            <Input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={(e) => setEventImage(e.target.files?.[0] || null)}
              className="mt-0.5 h-7 text-xs"
            />
            {eventImage && (
              <p className="text-xs text-green-600 mt-0.5">✓ {eventImage.name}</p>
            )}
          </div>

          {/* 공통 이미지 */}
          <div>
            <Label htmlFor="common-image" className="text-xs">배송안내 이미지</Label>
            <Input
              id="common-image"
              type="file"
              accept="image/*"
              onChange={(e) => setCommonImage(e.target.files?.[0] || null)}
              className="mt-0.5 h-7 text-xs"
            />
            {commonImage && (
              <p className="text-xs text-green-600 mt-0.5">✓ {commonImage.name}</p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end pt-2 border-t">
            <Button type="submit" size="sm" className="text-xs h-7">
              등록
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
