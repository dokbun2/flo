"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Product {
  id: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  status: "판매중" | "품절" | "판매중지";
  registeredDate: string;
  thumbnails?: {
    thumbnail1?: string;
    thumbnail2?: string;
    thumbnail3?: string;
  };
  detailContent?: string;
  eventImage?: string;
  commonImage?: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "registeredDate">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// 초기 상품 데이터
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "P001",
    productName: "프리미엄 축하화환 A",
    category: "축하화환",
    price: 150000,
    quantity: 10,
    description: "고급 장미와 카네이션으로 만든 프리미엄 축하화환",
    status: "판매중",
    registeredDate: "2024-03-15",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/781b0120-8c5e-4fc7-8d2e-e00f8439266f/0_3.png",
    },
  },
  {
    id: "P002",
    productName: "로즈 꽃다발 50송이",
    category: "꽃다발",
    price: 80000,
    quantity: 20,
    description: "신선한 빨간 장미 50송이 꽃다발",
    status: "판매중",
    registeredDate: "2024-03-14",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/f3006714-a5da-4371-867a-ec9267d48057/0_3.png",
    },
  },
  {
    id: "P003",
    productName: "몬스테라 대형",
    category: "관엽식물",
    price: 65000,
    quantity: 15,
    description: "공기정화 기능이 있는 몬스테라 대형",
    status: "판매중",
    registeredDate: "2024-03-13",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/c25bc457-6572-4871-ae2f-3aa37d0dc04d/0_0.png",
    },
  },
  {
    id: "P004",
    productName: "근조화환 기본형",
    category: "근조화환",
    price: 100000,
    quantity: 8,
    description: "깔끔하고 정중한 근조화환 기본형",
    status: "판매중",
    registeredDate: "2024-03-12",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/6b748ffe-880d-43ea-a988-db1bc1d8fe5d/0_2.png",
    },
  },
  {
    id: "P005",
    productName: "개업축하 난 세트",
    category: "개업축하",
    price: 200000,
    quantity: 5,
    description: "고급 난으로 구성된 개업축하 세트",
    status: "판매중",
    registeredDate: "2024-03-11",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/f3006714-a5da-4371-867a-ec9267d48057/0_3.png",
    },
  },
  {
    id: "P006",
    productName: "승진 축하 꽃바구니",
    category: "승진/취임",
    price: 120000,
    quantity: 12,
    description: "승진과 취임을 축하하는 고급 꽃바구니",
    status: "판매중",
    registeredDate: "2024-03-10",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/01b8d609-5e58-4ad0-acbb-c6a19b8d0e47/0_0.png",
    },
  },
  {
    id: "P007",
    productName: "결혼 축하 부케",
    category: "결혼/장례",
    price: 180000,
    quantity: 8,
    description: "웨딩을 더욱 아름답게 만드는 프리미엄 부케",
    status: "판매중",
    registeredDate: "2024-03-09",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/3dbe2cf6-b50e-4e69-94e3-83f2a4dc8f25/0_2.png",
    },
  },
  {
    id: "P008",
    productName: "플랜테리어 세트",
    category: "플랜테리어",
    price: 95000,
    quantity: 18,
    description: "공간을 꾸미는 플랜테리어 식물 세트",
    status: "판매중",
    registeredDate: "2024-03-08",
    thumbnails: {
      thumbnail1: "https://cdn.midjourney.com/c25bc457-6572-4871-ae2f-3aa37d0dc04d/0_0.png",
    },
  },
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // 클라이언트에서만 localStorage 로드
  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  // products 변경 시 localStorage 저장
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Omit<Product, "id" | "registeredDate">) => {
    const newProduct: Product = {
      ...product,
      id: `P${String(products.length + 1).padStart(3, "0")}`,
      registeredDate: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
