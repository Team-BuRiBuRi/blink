import { formatMoney } from '@/libs/utils';
import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    // 기존 환율 불러오기
    const { ars: appliedARS, btc: appliedBTC } = (
      await sql`SELECT * FROM appliedexchangerate`
    ).rows[0];

    // 현재 환율 api로 불러오기(utc로)
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const today = `${year}-${month}-${day}`;
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const time = `${hour}:${minute}`;
    const url = `https://xecdapi.xe.com/v1/historic_rate?to=BCH%2C%20ARS&date=${today}&time=${time}&crypto=true`;
    const username = process.env.XE_ID;
    const password = process.env.XE_KEY;
    const base64Credentials = Buffer.from(`${username}:${password}`).toString(
      'base64'
    );
    const response1 = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    const { to } = await response1.json();
    const currentARS = to[0].mid;
    const currentBCH = to[1].mid;

    // 로직에 넣어서 업데이트 할지 말지 결정
    if (
      appliedARS / currentARS > 1.05 ||
      appliedARS / currentARS < 0.95 ||
      appliedBTC / currentBCH > 1.05 ||
      appliedBTC / currentBCH < 0.95
    ) {
      await sql`UPDATE appliedexchangerate SET ars = ${currentARS}, btc = ${currentBCH}`;

      // 모든 shop의 fee 별로 모든 물건의 els 업데이트
      const accessToken = (await sql`SELECT accesstoken FROM Auth;`).rows[0]
        .accesstoken;

      const shops = (await sql`SELECT * FROM shop;`).rows;
      for (const shop of shops) {
        const products = (
          await sql`SELECT * FROM product WHERE shopId = ${shop.id};`
        ).rows;
        for (const product of products) {
          const bodyInput = await fetch(
            `http://3.143.203.132:3000?id=${product.id}&name=${
              product.name
            }&usd=${formatMoney(
              parseFloat(product.price) * parseFloat(shop.fee),
              'USD'
            )}&ars=${formatMoney(
              parseFloat(product.price) *
                parseFloat(shop.fee) *
                parseFloat(currentARS),
              'ARS'
            )}&btc=${formatMoney(
              parseFloat(product.price) *
                parseFloat(shop.fee) *
                parseFloat(currentBCH),
              'BTC'
            )}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));

          await fetch(
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
        }
      }
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }

  return response.status(200).json({ success: true });
}
