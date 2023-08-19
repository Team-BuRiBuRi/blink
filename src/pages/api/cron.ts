import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    // const petName = 'petName' + Date.now();
    // const ownerName = 'ownerName' + Date.now();
    // await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
    await fetch('https://stage00.common.solumesl.com/api/v2/');
  } catch (error) {
    // console.log(error);
    return response.status(500).json({ error });
  }

  return response.status(204).send('');
}
