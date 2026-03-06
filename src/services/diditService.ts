/**
 * Didit Platform Integration Service
 * Handles payment verification and tracking
 */

const DIDIT_API_URL = process.env.NEXT_PUBLIC_DIDIT_API_URL || 'https://api.didit.in';
const DIDIT_API_KEY = process.env.DIDIT_API_KEY || '';

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
  branchName?: string;
  verified: boolean;
}

export interface PaymentVerification {
  id: string;
  amount: number;
  utr: string;
  status: 'pending' | 'verified' | 'failed';
  verifiedAt?: string;
}

export const diditService = {
  /**
   * Verify IFSC code and fetch bank details
   */
  async verifyIFSC(ifscCode: string): Promise<BankDetails> {
    try {
      // Use IFSC API (free public API)
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      
      if (!response.ok) {
        throw new Error('Invalid IFSC code');
      }
      
      const data = await response.json();
      
      return {
        accountNumber: '',
        ifscCode: ifscCode.toUpperCase(),
        bankName: data.BANK,
        branchName: data.BRANCH,
        verified: true
      };
    } catch (error) {
      console.error('IFSC verification failed:', error);
      return {
        accountNumber: '',
        ifscCode: ifscCode.toUpperCase(),
        verified: false
      };
    }
  },

  /**
   * Verify bank account using Didit
   */
  async verifyBankAccount(accountNumber: string, ifscCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${DIDIT_API_URL}/verify/bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIDIT_API_KEY}`
        },
        body: JSON.stringify({
          account_number: accountNumber,
          ifsc_code: ifscCode
        })
      });

      const result = await response.json();
      return result.verified === true;
    } catch (error) {
      console.error('Bank verification failed:', error);
      return false;
    }
  },

  /**
   * Create payment verification request
   */
  async createVerificationRequest(data: {
    amount: number;
    utr: string;
    accountNumber: string;
    ifscCode: string;
    userId: string;
  }): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${DIDIT_API_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIDIT_API_KEY}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      return {
        id: result.verification_id,
        amount: data.amount,
        utr: data.utr,
        status: 'pending',
      };
    } catch (error) {
      console.error('Payment verification creation failed:', error);
      throw error;
    }
  },

  /**
   * Check payment verification status
   */
  async checkVerificationStatus(verificationId: string): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${DIDIT_API_URL}/payments/verify/${verificationId}`, {
        headers: {
          'Authorization': `Bearer ${DIDIT_API_KEY}`
        }
      });

      const result = await response.json();
      
      return {
        id: verificationId,
        amount: result.amount,
        utr: result.utr,
        status: result.status,
        verifiedAt: result.verified_at
      };
    } catch (error) {
      console.error('Status check failed:', error);
      throw error;
    }
  },

  /**
   * Webhook handler for Didit callbacks
   */
  async handleWebhook(payload: any): Promise<void> {
    // Verify webhook signature
    // Update payment status in database
    console.log('Didit webhook received:', payload);
  }
};