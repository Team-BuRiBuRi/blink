import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'GET') {
    try {
      const appliedExchangeRate = (await sql`SELECT * FROM appliedexchangerate`)
        .rows[0];

      return response.status(200).json(appliedExchangeRate);
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
}
