/**
 * numeric은 postgresql에서 사용하는 데이터 타입입니다. 정밀한 숫자를 표현하므로 string 타입으로 받아야 합니다.
 */

interface Shop {
    id: number; // integer
    name: string; // character varying
    thumbnail: string; // text - base64
    // USD가 아닌 경우 적용
    fee: string; // numeric
}

// 모든 price는 USD 기준
interface Product {
    id: number; // integer
    shopId: number; // integer
    name: string; // character varying
    thumbnail: string; // text - base64
    // 판매하고 싶은 금액 - 기계 전부 업데이트
    price: string; // numeric
    // 살 때 가격 - 고정
    buyPrice: string; // numeric
    // 살 때 수량 - 고정
    buyQuantity: number; // integer
    // 총 매출 - 판매 당시 환율 기준
    totalSales: string; // numeric
    // 총 판매 수량 - 판매 당시 환율 기준
    totalSalesQuantity: number; // integer
}

// cron으로 watching. 급격한 환율 변동이 있으면 모든 상품 기계 업데이트 하고 최신으로 업데이트
interface AppliedExchangeRate {
    ars: string; // numeric
    btc: string; // numeric
}

interface Price {
    mid: number;
    timestamp: string;
}

type Currencies = "BTC" | "ARS";