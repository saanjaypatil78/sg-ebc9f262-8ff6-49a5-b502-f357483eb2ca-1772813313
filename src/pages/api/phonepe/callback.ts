import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { supabase } from '@/integrations/supabase/client';
import { investmentService } from '@/services/investmentService';

const PHONEPE_CONFIG = {
  SALT_KEY: process.env.PHONEPE_SALT_KEY || '',
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { response } = req.body;
    const xVerify = req.headers['x-verify'] as string;

    if (!response || !xVerify) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // 1. Verify Checksum
    const stringToVerify = response + PHONEPE_CONFIG.SALT_KEY;
    const calculatedChecksum = crypto.createHash('sha256').update(stringToVerify).digest('hex') + '###' + PHONEPE_CONFIG.SALT_INDEX;

    if (calculatedChecksum !== xVerify) {
      return res.status(400).json({ message: 'Invalid checksum' });
    }

    // 2. Decode Response
    const decodedData = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
    const { code, merchantTransactionId, transactionId, amount } = decodedData.data;

    const status = code === 'PAYMENT_SUCCESS' ? 'success' : 'failed';

    // 3. Update Transaction in DB
    const { data: transaction, error: updateError } = await (supabase.from("phonepe_transactions") as any)
      .update({
        phonepe_transaction_id: transactionId,
        status: status,
        callback_data: decodedData,
        completed_at: new Date().toISOString()
      })
      .eq("transaction_id", response) // Use transaction_id from the base64 response
      .select()
      .single();

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return res.status(500).json({ message: 'Database error' });
    }

    // 4. If Success & Investment, Create Agreement
    if (status === 'success' && transaction?.transaction_type === 'investment') {
      try {
        await investmentService.createAgreement(
          transaction.user_id,
          transaction.amount // Amount is already stored in correct units
        );
        console.log('Investment agreement created for:', merchantTransactionId);
      } catch (err) {
        console.error('Error creating agreement:', err);
        // Don't fail the callback, just log it. Admin can reconcile later.
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Callback Handler Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}