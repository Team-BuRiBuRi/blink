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

      // fee 먹인 채로 상품 els 업데이트
      const accessToken = (await sql`SELECT accesstoken FROM Auth;`).rows[0]
        .accesstoken;

      // 해당 shop의 모든 상품 불러오기
      const products = (
        await sql`SELECT * FROM product WHERE shopId = ${body.id};`
      ).rows;

      const { ars: appliedARS, btc: appliedBTC } = (
        await sql`SELECT * FROM appliedexchangerate`
      ).rows[0];

      // 모든 상품의 els 업데이트
      for (const product of products) {
        const bodyInput = await fetch(
          `http://3.143.203.132:3000?id=${product.id}&name=${
            product.name
          }&usd=${Number(product.price) * Number(body.fee)}&ars=${
            Number(product.price) * Number(body.fee) * Number(appliedARS)
          }&brc=${
            Number(product.price) * Number(body.fee) * Number(appliedBTC)
          }`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));

        const result = await fetch(
          'https://stage00.common.solumesl.com/common/api/v2/common/labels/image?company=JC04&store=1111',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + accessToken,
            },
            body: JSON.stringify(bodyInput),
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log(err));

        console.log(parseFloat(product.price));

        console.log(parseFloat(body.fee));
        console.log(parseFloat(appliedBTC));
      }

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
