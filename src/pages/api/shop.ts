import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'PATCH') {
    try {
      const body = request.body as PatchShopRequestBody;
      const shop = (await sql`SELECT * FROM shop WHERE id = ${body.id};`)
        .rows[0];
      if (!shop) {
        return response.status(404).json({ error: 'Shop not found' });
      }
      if (!body.fee) {
        return response.status(400).json({ error: 'Invalid body' });
      }

      await sql`UPDATE shop SET Fee=${body.fee} WHERE id=${body.id};`;
      return response.status(200).json({ success: true });
    } catch (error) {
      return response.status(500).json({ error });
    }
  } else if (request.method === 'GET') {
    try {
      const id = request.query.id as string;
      const shop = (await sql`SELECT * FROM shop WHERE id = ${id};`).rows[0];
      if (!shop) {
        return response.status(404).json({ error: 'Shop not found' });
      }

      return response.status(200).json(shop);
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
}
