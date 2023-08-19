import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const response = await fetch('http://3.143.203.132:3000/');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }

  return response.status(200).json({ success: true });
}
