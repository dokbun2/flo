"use client";

import { useState, useMemo } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for daily sales by date
const generateDailySalesData = (date: Date) => {
  const day = date.getDate();
  const randomMultiplier = Math.sin(day) * 0.5 + 0.8; // 날짜별로 다른 판매량

  return [
    { productName: "프리미엄 축하화환 A", quantity: Math.floor(3 * randomMultiplier), unitPrice: 150000 },
    { productName: "로즈 꽃다발 50송이", quantity: Math.floor(5 * randomMultiplier), unitPrice: 80000 },
    { productName: "몬스테라 대형", quantity: Math.floor(2 * randomMultiplier), unitPrice: 65000 },
    { productName: "근조화환 기본형", quantity: Math.floor(1 * randomMultiplier), unitPrice: 100000 },
    { productName: "개업축하 난 세트", quantity: Math.floor(2 * randomMultiplier), unitPrice: 200000 },
  ];
};

// Mock data for monthly sales
const monthlySalesData = [
  { month: "1월", productName: "축하화환 전체", quantity: 45, unitPrice: 150000, total: 6750000 },
  { month: "2월", productName: "꽃다발 전체", quantity: 120, unitPrice: 75000, total: 9000000 },
  { month: "3월", productName: "관엽식물 전체", quantity: 68, unitPrice: 55000, total: 3740000 },
  { month: "4월", productName: "근조화환 전체", quantity: 32, unitPrice: 100000, total: 3200000 },
  { month: "5월", productName: "개업축하 상품", quantity: 28, unitPrice: 180000, total: 5040000 },
  { month: "6월", productName: "계절 꽃다발", quantity: 95, unitPrice: 65000, total: 6175000 },
  { month: "7월", productName: "여름 식물", quantity: 78, unitPrice: 45000, total: 3510000 },
  { month: "8월", productName: "축하화환 전체", quantity: 52, unitPrice: 150000, total: 7800000 },
  { month: "9월", productName: "가을 꽃다발", quantity: 88, unitPrice: 70000, total: 6160000 },
  { month: "10월", productName: "국화 상품", quantity: 102, unitPrice: 40000, total: 4080000 },
  { month: "11월", productName: "겨울 식물", quantity: 65, unitPrice: 50000, total: 3250000 },
  { month: "12월", productName: "크리스마스 상품", quantity: 145, unitPrice: 85000, total: 12325000 },
];

export default function SalesDashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState("2024");
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('ko-KR')}원`;
  };

  const dailySalesData = useMemo(() => generateDailySalesData(date), [date]);

  const calculateDailyTotal = () => {
    return dailySalesData.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // 월별 일일 매출 계산
  const getDailySalesTotal = (checkDate: Date) => {
    const salesData = generateDailySalesData(checkDate);
    return salesData.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // 달력 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    return eachDayOfInterval({ start, end });
  }, [calendarMonth]);

  const calculateYearlyTotal = () => {
    return monthlySalesData.reduce((total, item) => total + item.total, 0);
  };

  const years = ["2024", "2023", "2022", "2021", "2020"];

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-gray-900">매출 현황</h1>
      </div>

      <Tabs defaultValue="daily" className="space-y-2">
        <TabsList className="grid w-full max-w-xs grid-cols-2 h-8">
          <TabsTrigger value="daily" className="text-xs">일간</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">월간</TabsTrigger>
        </TabsList>

        {/* 일간 매출 탭 */}
        <TabsContent value="daily" className="space-y-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* 캘린더 */}
            <div className="bg-white rounded-lg shadow p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-900">
                  {format(calendarMonth, "yyyy-MM", { locale: ko })}
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1 max-h-96 overflow-y-auto">
                {calendarDays.map((day) => {
                  const dailyTotal = getDailySalesTotal(day);
                  const isSelected = isSameDay(day, date);
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setDate(day)}
                      className={cn(
                        "w-full p-2 rounded text-left transition-colors border text-xs",
                        isSelected
                          ? "bg-primary-500 text-white border-primary-600"
                          : "hover:bg-gray-100 border-gray-200"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{format(day, "dd")}</span>
                        <span className={cn("text-xs", isSelected ? "text-white" : "text-primary-600 font-semibold")}>
                          {(dailyTotal / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 일일 매출 현황 */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-3">
              <div className="mb-2">
                <h2 className="text-xs font-semibold text-gray-900">
                  {format(date, "MM-dd")} 매출
                </h2>
                <p className="text-sm font-bold text-primary-600 mt-1">
                  {formatPrice(calculateDailyTotal())}
                </p>
              </div>

            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs h-6">제품명</TableHead>
                  <TableHead className="text-center text-xs w-[60px]">수량</TableHead>
                  <TableHead className="text-right text-xs w-[80px]">단가</TableHead>
                  <TableHead className="text-right text-xs w-[80px]">소계</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailySalesData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-xs truncate">{item.productName}</TableCell>
                    <TableCell className="text-center text-xs">{item.quantity}개</TableCell>
                    <TableCell className="text-right text-xs">{(item.unitPrice / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="text-right font-semibold text-xs">
                      {formatPrice(item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell colSpan={3} className="text-xs">합계</TableCell>
                  <TableCell className="text-right text-xs text-primary-600">
                    {formatPrice(calculateDailyTotal())}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </div>
          </div>
        </TabsContent>

        {/* 월간 매출 탭 */}
        <TabsContent value="monthly" className="space-y-2">
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-900">월별 매출</h2>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24 h-7 text-xs">
                  <SelectValue placeholder="연도" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year} className="text-xs">
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-[50px]">월</TableHead>
                  <TableHead className="text-xs">제품명</TableHead>
                  <TableHead className="text-center text-xs w-[60px]">수량</TableHead>
                  <TableHead className="text-right text-xs w-[70px]">단가</TableHead>
                  <TableHead className="text-right text-xs w-[90px]">합계</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlySalesData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-xs">{item.month}</TableCell>
                    <TableCell className="text-xs truncate">{item.productName}</TableCell>
                    <TableCell className="text-center text-xs">{item.quantity}</TableCell>
                    <TableCell className="text-right text-xs">{(item.unitPrice / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="text-right font-semibold text-xs">
                      {formatPrice(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell colSpan={4} className="text-xs">{selectedYear} 연간</TableCell>
                  <TableCell className="text-right text-xs text-primary-600">
                    {formatPrice(calculateYearlyTotal())}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}