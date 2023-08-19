// 상점 수정
interface PatchShopRequestBody extends Pick<Shop, 'id' | 'fee'> {} // clear

// 물건 추가
interface PostProductRequestBody {
  shopId: Product['shopid'];
  price: Product['price'];
  buyPrice: Product['buyprice'];
  buyQuantity: Product['buyquantity'];
  name: Product['name'];
  thumbnail: Product['thumbnail'];
}

// 물건 수정
interface PatchProductRequestBody extends Pick<Product, 'id' | 'price'> {} // clear

// 상점 조회
interface GetShopRequestQuery extends Pick<Shop, 'id'> {} // clear
interface GetShopResponse extends Shop {} // clear

// 물건 조회
interface GetProductRequestQuery extends Pick<Product, 'id'> {} // clear
interface GetProductResponse extends Product {} // clear

// 물건 목록 조회
interface GetProductsRequestQuery {
  shopId: Product['shopid'];
}
interface GetProductsResponse {
  products: Product[];
} // clear

// 적용 환율 조회
interface GetAppliedExchangeRateResponse extends AppliedExchangeRate {} // clear

// 물건 구매
interface ElementForBuyProduct {
  productId: number;
  quantity: number;
}
type PostBuyProductRequestBody = ElementForBuyProduct[]; // clear

interface XEAPIResponse {
  term: string;
  privacy: string;
  from: 'USD';
  amount: number;
  to: {
    [key in Currencies]: Price[];
  };
}
