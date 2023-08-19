export const mockGetProduct = (productId: number): GetProductResponse => {
  return {
    id: productId,
    name: 'Tomato',
    shopId: 2,
    price: '3000',
    buyPrice: '2000',
    buyQuantity: 20,
    totalSales: '400000',
    totalSalesQuantity: 15,
    thumbnail:
      'https://i.namu.wiki/i/c7fRtsUWjvUJV-E_6tRMcEw1lmxUQecAKRPqCTjuL5dV-nd05DMjqwQskwUa-vl7anSY0QFkonKAM6wwOnBn4rgJEMl3bULh--6YMTIBAvnBGONvGqKLSGp5kt4wxU-7NcNNNFVjZvIatWEAogDtyg.webp',
  };
};
