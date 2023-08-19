interface Product {
  id: number;
  name: string;
  thumbnail: string;
  displayPrice: {
    pivotType: 'ARS' | 'USD' | 'BTC';
    pivotPrice: number;
  };
}

interface SupplierProduct extends Product {
  originalPrice: { btc: number };
  numSales: number;
}

// interface CustomerProduct extends Product {}

interface API {
  getProductInfo: (productID: number) => SupplierProduct | undefined;
  setPrice: (newPrice: {
    pivotType: 'ARS' | 'USD' | 'BTC';
    pivotPrice: number;
  }) => boolean;
}

// interface CustomerApi {
//   // 장바구니에 담겨있는건 로컬스토리지에서 알아서 받아오기
//   getProductInfo: (productID: number) => CustomerProduct | undefined;
// }
