import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || '',
  SALT_KEY: process.env.PHONEPE_SALT_KEY || '',
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  API_URL: process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  REDIRECT_URL: process.env.NEXT_PUBLIC_APP_URL + '/api/phonepe/callback',
  WEBHOOK_URL: process.env.NEXT_PUBLIC_APP_URL + '/api/phonepe/webhook',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, userId, mobileNumber, merchantTransactionId } = req.body;

    const paymentPayload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: PHONEPE_CONFIG.REDIRECT_URL,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.WEBHOOK_URL,
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    const stringToSign = base64Payload + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
    const checksum = crypto.createHash('sha256').update(stringToSign).digest('hex') + '###' + PHONEPE_CONFIG.SALT_INDEX;

    const response = await fetch(`${PHONEPE_CONFIG.API_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('PhonePe Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}