import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    try {
      const body = request.body as PostProductRequestBody;
      const shop = (await sql`SELECT * FROM shop WHERE id = ${body.shopId};`)
        .rows[0];
      if (!shop) {
        return response.status(404).json({ error: 'Shop not found' });
      }
      if (
        !body.price ||
        !body.buyPrice ||
        !body.buyQuantity ||
        !body.name ||
        !body.thumbnail
      ) {
        return response.status(400).json({ error: 'Invalid body' });
      }

      await sql`INSERT INTO product (shopId, price, buyPrice, buyQuantity, totalSales, totalSalesQuantity, name, thumbnail) VALUES (${body.shopId}, ${body.price}, ${body.buyPrice}, ${body.buyQuantity}, 0, 0, ${body.name}, ${body.thumbnail});`;
      return response.status(200).json({ success: true });
    } catch (error) {
      return response.status(500).json({ error });
    }
  } else if (request.method === 'PATCH') {
    try {
      const body = request.body as PatchProductRequestBody;
      const product = (await sql`SELECT * FROM product WHERE id = ${body.id};`)
        .rows[0];
      if (!product) {
        return response.status(404).json({ error: 'Product not found' });
      }
      if (!body.price) {
        return response.status(400).json({ error: 'Invalid body' });
      }

      await sql`UPDATE product SET price = ${body.price} WHERE id = ${body.id};`;
      // fee 먹인 채로 상품 els 업데이트
      return response.status(200).json({ success: true });
    } catch (error) {
      return response.status(500).json({ error });
    }
  } else if (request.method === 'GET') {
    try {
      const id = request.query.id as string;
      if (id === undefined) {
        const shopId = request.query.shopId as string;
        if (shopId === undefined) {
          const products = (await sql`SELECT * FROM product;`).rows;

          return response.status(200).json(products);
        } else {
          const shop = (await sql`SELECT * FROM shop WHERE id = ${shopId};`)
            .rows[0];
          if (!shop) {
            return response.status(404).json({ error: 'Shop not found' });
          }

          const products = (
            await sql`SELECT * FROM product WHERE shopId = ${shopId};`
          ).rows;

          return response.status(200).json(products);
        }
      } else {
        const product = (await sql`SELECT * FROM product WHERE id = ${id};`)
          .rows[0];
        if (!product) {
          return response.status(404).json({ error: 'Product not found' });
        }

        return response.status(200).json(product);
      }
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
}
