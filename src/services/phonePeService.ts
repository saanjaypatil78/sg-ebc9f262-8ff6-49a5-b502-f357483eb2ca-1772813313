import { supabase } from "@/integrations/supabase/client";

// PhonePe API Configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || '',
  SALT_KEY: process.env.PHONEPE_SALT_KEY || '',
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  API_URL: process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  REDIRECT_URL: process.env.NEXT_PUBLIC_APP_URL + '/api/phonepe/callback',
  WEBHOOK_URL: process.env.NEXT_PUBLIC_APP_URL + '/api/phonepe/webhook',
};

export interface PhonePePaymentRequest {
  amount: number;
  userId: string;
  agreementId?: string;
  purpose: 'investment' | 'payout';
  mobileNumber: string;
}

export interface PhonePeTransaction {
  id: string;
  user_id: string;
  agreement_id: string | null;
  merchant_transaction_id: string;
  phonepe_transaction_id: string | null;
  amount: number;
  status: 'initiated' | 'pending' | 'success' | 'failed';
  transaction_type: 'investment' | 'payout';
  payment_method: string | null;
  callback_data: any;
  created_at: string;
  completed_at: string | null;
}

export const phonePeService = {
  /**
   * Initiate investment payment via backend API
   */
  async initiateInvestmentPayment(request: PhonePePaymentRequest): Promise<{ 
    paymentUrl: string; 
    transactionId: string 
  }> {
    const merchantTransactionId = `INV_${Date.now()}_${request.userId.substring(0, 8)}`;

    // Store transaction in database FIRST
    const { data: transaction, error } = await supabase
      .from('phonepe_transactions')
      .insert({
        user_id: request.userId,
        agreement_id: request.agreementId || null,
        merchant_transaction_id: merchantTransactionId,
        amount: request.amount,
        status: 'initiated',
        transaction_type: request.purpose
      } as any) // Explicitly cast to any to avoid "excessively deep" error
      .select()
      .single();

    if (error) throw error;

    // Call Backend API to generate checksum and initiate payment
    const response = await fetch('/api/phonepe/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: request.amount,
        userId: request.userId,
        mobileNumber: request.mobileNumber,
        merchantTransactionId: merchantTransactionId
      })
    });

    const result = await response.json();

    if (result.success) {
      return {
        paymentUrl: result.data.instrumentResponse.redirectInfo.url,
        transactionId: transaction?.id || ''
      };
    }

    throw new Error('PhonePe payment initiation failed');
  },

  /**
   * Check payment status via backend API
   */
  async checkPaymentStatus(merchantTransactionId: string): Promise<any> {
    const response = await fetch('/api/phonepe/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantTransactionId })
    });

    return await response.json();
  },

  /**
   * Handle payment callback
   */
  async handlePaymentCallback(callbackData: any): Promise<void> {
    const { merchantTransactionId, transactionId, code } = callbackData;

    const status = code === 'PAYMENT_SUCCESS' ? 'success' : 'failed';

    await supabase
      .from('phonepe_transactions')
      .update({
        phonepe_transaction_id: transactionId,
        status: status,
        callback_data: callbackData,
        completed_at: new Date().toISOString()
      } as any)
      .eq('merchant_transaction_id', merchantTransactionId);

    // If successful investment, create agreement
    if (status === 'success') {
      const { data: transaction } = await supabase
        .from('phonepe_transactions')
        .select('*')
        .eq('merchant_transaction_id', merchantTransactionId)
        .single();

      if (transaction && transaction.transaction_type === 'investment') {
        // Create investment agreement
        const { investmentService } = await import('./investmentService');
        await investmentService.createAgreement(
          transaction.user_id,
          parseFloat(transaction.amount.toString())
        );
      }
    }
  },

  /**
   * Get user's transaction history
   */
  async getTransactionHistory(userId: string): Promise<PhonePeTransaction[]> {
    const { data, error } = await supabase
      .from('phonepe_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as PhonePeTransaction[];
  },
  
  // Removed client-side generateChecksum to protect SALT_KEY
  generateChecksum(payload: string): string {
     throw new Error("Checksum generation moved to backend for security");
  }
};