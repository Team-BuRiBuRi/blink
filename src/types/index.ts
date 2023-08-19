interface Price {
  pivotType: 'ARS' | 'USD' | 'BTC';
  pivotPrice: number;
}

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  displayPrice: Price;
}

interface SupplierProduct extends Product {
  originalPrice: Price;
  numSales: number;
}

// interface CustomerProduct extends Product {}

interface API {
  getProductInfo: (productID: number) => SupplierProduct | undefined;
  setDisplayPrice: (newPrice: {
    pivotType: 'ARS' | 'USD' | 'BTC';
    pivotPrice: number;
  }) => boolean;
  setOriginalPrice: (newPrice: {
    pivotType: 'ARS' | 'USD' | 'BTC';
    pivotPrice: number;
  }) => boolean;
}

// interface CustomerApi {
//   // 장바구니에 담겨있는건 로컬스토리지에서 알아서 받아오기
//   getProductInfo: (productID: number) => CustomerProduct | undefined;
// }
