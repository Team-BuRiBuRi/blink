interface PatchShopRequestBody extends Pick<Shop, 'id' | 'fee'> {}

interface PostProductRequestBody
  extends Pick<Product, 'shopId' | 'price' | 'buyPrice' | 'buyQuantity'> {}

interface PatchProductRequestBody extends Pick<Product, 'id' | 'price'> {}

interface GetShopResponse extends Shop {}

interface GetProductResponse extends Product {}
