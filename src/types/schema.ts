interface Shop {
  id: number;
  name: string;
  thumbnail: string;
  fee: number; // USD가 아닌 경우
}

// 모든 price는 USD 기준
interface Product {
  id: number;
  name: string;
  thumbnail: string;
  shopId: number;
  // 판매하고 싶은 금액 - 기계 전부 업데이트
  price: number;
  // 살 때 가격 - 고정
  buyPrice: number;
  // 살 때 수량 - 고정
  buyQuantity: number;
  // 총 매출 - 판매 당시 환율 기준
  totalSales: number;
  // 총 판매 수량 - 판매 당시 환율 기준
  totalSalesQuantity: number;
}

// cron으로 보다가 급격한 환율 변동이 있으면 모든 상품 기계 업데이트 하고 최신으로 업데이트
interface AppliedExchangeRate {
  ARS: number;
  BTC: number;
}
