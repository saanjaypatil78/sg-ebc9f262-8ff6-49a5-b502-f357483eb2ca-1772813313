import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || '',
  SALT_KEY: process.env.PHONEPE_SALT_KEY || '',
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  API_URL: process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { merchantTransactionId } = req.body;

    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${merchantTransactionId}`;
    const stringToSign = endpoint + PHONEPE_CONFIG.SALT_KEY;
    const checksum = crypto.createHash('sha256').update(stringToSign).digest('hex') + '###' + PHONEPE_CONFIG.SALT_INDEX;

    const response = await fetch(`${PHONEPE_CONFIG.API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID
      }
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('PhonePe Status Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}