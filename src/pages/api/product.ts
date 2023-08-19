import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

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

      const pk = Date.now().toString().slice(4, 17);
      await sql`INSERT INTO product (id, shopId, price, buyPrice, buyQuantity, totalSales, totalSalesQuantity, name, thumbnail) VALUES (${pk}, ${body.shopId}, ${body.price}, ${body.buyPrice}, ${body.buyQuantity}, 0, 0, ${body.name}, ${body.thumbnail});`;

      return response.status(200).json({ success: true, pk });
    } catch (error) {
      console.log(error);
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

      const accessToken = (await sql`SELECT accesstoken FROM Auth;`).rows[0]
        .accesstoken;

      const shop = (await sql`SELECT * FROM shop WHERE id = ${product.shopId};`)
        .rows[0];

      const { ars: appliedARS, btc: appliedBTC } = (
        await sql`SELECT * FROM appliedexchangerate`
      ).rows[0];

      await fetch(
        'https://stage00.common.solumesl.com/common/api/v2/common/labels/image?company=JC04&store=1111',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify(
            await fetch(
              `http://3.143.203.132:3000?id=${product.id}&name=${
                product.name
              }&usd=${Number(body.price) * Number(shop.fee)}&ars=${
                Number(body.price) * Number(shop.fee) * Number(appliedARS)
              }&brc=${
                Number(body.price) * Number(shop.fee) * Number(appliedBTC)
              }`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          ),
        }
      );

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
          const products = (await sql`SELECT * FROM product ORDER BY id DESC;`)
            .rows;

          return response.status(200).json(products);
        } else {
          const shop = (await sql`SELECT * FROM shop WHERE id = ${shopId};`)
            .rows[0];
          if (!shop) {
            return response.status(404).json({ error: 'Shop not found' });
          }

          const products = (
            await sql`SELECT * FROM product WHERE shopId = ${shopId} ORDER BY id DESC;`
          ).rows;

          return response.status(200).json(products);
        }
      } else {
        const product = (
          await sql`SELECT * FROM product WHERE id = ${id} ORDER BY id DESC;`
        ).rows[0];
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
