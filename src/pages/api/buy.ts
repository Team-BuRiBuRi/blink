import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const errors: string[] = [];

  try {
    if (request.method === 'POST') {
      for (const element of request.body as PostBuyProductRequestBody) {
        const product =
          await sql`SELECT * FROM product WHERE id=${element.productId}`;
        if (!product) {
          errors.push(`Product ${element.productId} not found`);
          continue;
        }
        const quantity = element.quantity;
        if (quantity <= 0) {
          errors.push(`Invalid quantity ${element.quantity}`);
          continue;
        }

        const shop =
          await sql`SELECT * FROM shop WHERE id=${product.rows[0].shopid}`;
        const fee = parseFloat(shop.rows[0].fee);
        const price = parseFloat(product.rows[0].price);
        const totalSales = parseFloat(product.rows[0].totalsales);
        const totalSalesQuantity = parseFloat(
          product.rows[0].totalsalesquantity
        );

        await sql`UPDATE product SET totalSales = ${
          totalSales + price * quantity * fee
        }, totalSalesQuantity = ${totalSalesQuantity + quantity} WHERE id = ${
          element.productId
        };`;
      }

      if (errors.length) {
        return response.status(400).json({ errors });
      }
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: 'Internal server error' });
  }

  return response.status(200).json({ success: true });
}
