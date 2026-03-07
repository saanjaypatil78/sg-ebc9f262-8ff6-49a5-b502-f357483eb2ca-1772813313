import { supabase } from "@/integrations/supabase/client";

export interface RankUpgradeEmailData {
  userEmail: string;
  userName: string;
  previousRank: string;
  newRank: string;
  newCommissionRates: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
    level6: number;
  };
  totalBusinessVolume: number;
  nextRankTarget?: number;
}

export interface WithdrawalNotificationData {
  userEmail: string;
  userName: string;
  amount: number;
  status: "PENDING" | "ADMIN_APPROVED" | "PAYMENT_PROCESSING" | "COMPLETED" | "REJECTED";
  referenceNumber?: string;
  rejectionReason?: string;
}

export interface PayoutNotificationData {
  userEmail: string;
  userName: string;
  amount: number;
  month: string;
  payoutDate: string;
  investmentAmount: number;
  roi: number;
}

export const emailNotifications = {
  /**
   * Send rank upgrade congratulations email
   */
  async sendRankUpgradeEmail(data: RankUpgradeEmailData): Promise<void> {
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .badge { display: inline-block; padding: 10px 20px; background: #f97316; color: white; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .commission-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .commission-table th, .commission-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            .commission-table th { background: #edf2f7; font-weight: bold; }
            .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .footer { text-align: center; color: #718096; font-size: 14px; margin-top: 20px; }
            .cta-button { display: inline-block; background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations ${data.userName}!</h1>
              <h2>You've Been Upgraded to ${data.newRank} Rank!</h2>
            </div>
            <div class="content">
              <p>Dear ${data.userName},</p>
              
              <p>We're thrilled to inform you that you've achieved a major milestone in your investment journey!</p>
              
              <div class="highlight">
                <strong>Rank Progression:</strong><br>
                ${data.previousRank} → <span class="badge">${data.newRank}</span>
              </div>
              
              <p><strong>Your Total Business Volume:</strong> ₹${this.formatCurrency(data.totalBusinessVolume)}</p>
              
              ${data.nextRankTarget ? `<p><strong>Next Target (${this.getNextRank(data.newRank)}):</strong> ₹${this.formatCurrency(data.nextRankTarget)}</p>` : '<p><strong>Status:</strong> You\'ve reached the highest rank! 🏆</p>'}
              
              <h3>Your New Commission Rates:</h3>
              <table class="commission-table">
                <tr>
                  <th>Level</th>
                  <th>Commission Rate</th>
                </tr>
                <tr>
                  <td>Level 1 (Direct Referrals)</td>
                  <td><strong>${data.newCommissionRates.level1}%</strong></td>
                </tr>
                <tr>
                  <td>Level 2</td>
                  <td><strong>${data.newCommissionRates.level2}%</strong></td>
                </tr>
                <tr>
                  <td>Level 3</td>
                  <td><strong>${data.newCommissionRates.level3}%</strong></td>
                </tr>
                <tr>
                  <td>Level 4</td>
                  <td><strong>${data.newCommissionRates.level4}%</strong></td>
                </tr>
                <tr>
                  <td>Level 5</td>
                  <td><strong>${data.newCommissionRates.level5}%</strong></td>
                </tr>
                <tr>
                  <td>Level 6</td>
                  <td><strong>${data.newCommissionRates.level6}%</strong></td>
                </tr>
              </table>
              
              <div class="highlight">
                <strong>What This Means:</strong><br>
                All your future commissions will be calculated using these enhanced rates. Your monthly payouts will automatically increase!
              </div>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/investor" class="cta-button">
                  View Your Dashboard
                </a>
              </center>
              
              <p>Keep growing your network to reach even higher ranks and earn more!</p>
              
              <p>Best regards,<br>
              <strong>Brave Ecom Team</strong></p>
              
              <div class="footer">
                <p>This is an automated notification. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} Brave Ecom. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email via Supabase Edge Function or external service
      // For now, log to console (can be replaced with actual email service)
      console.log("📧 Rank Upgrade Email:", {
        to: data.userEmail,
        subject: `🎉 Congratulations! Upgraded to ${data.newRank} Rank`,
        html: emailHtml,
      });

      // Store notification in database
      await this.storeNotification({
        userEmail: data.userEmail,
        type: "RANK_UPGRADE",
        title: `Upgraded to ${data.newRank}`,
        message: `Congratulations! You've been upgraded from ${data.previousRank} to ${data.newRank} rank.`,
        metadata: data,
      });
    } catch (error) {
      console.error("Failed to send rank upgrade email:", error);
      throw error;
    }
  },

  /**
   * Send withdrawal status notification
   */
  async sendWithdrawalNotification(data: WithdrawalNotificationData): Promise<void> {
    const statusMessages = {
      PENDING: {
        subject: "Withdrawal Request Received",
        message: `Your withdrawal request for ₹${this.formatCurrency(data.amount)} has been received and is pending admin review.`,
      },
      ADMIN_APPROVED: {
        subject: "Withdrawal Approved by Admin",
        message: `Good news! Your withdrawal request for ₹${this.formatCurrency(data.amount)} has been approved by admin and is awaiting final confirmation.`,
      },
      PAYMENT_PROCESSING: {
        subject: "Payment Processing",
        message: `Your withdrawal of ₹${this.formatCurrency(data.amount)} is being processed.`,
      },
      COMPLETED: {
        subject: "Withdrawal Completed",
        message: `Your withdrawal of ₹${this.formatCurrency(data.amount)} has been completed. Reference: ${data.referenceNumber}`,
      },
      REJECTED: {
        subject: "Withdrawal Request Rejected",
        message: `Your withdrawal request for ₹${this.formatCurrency(data.amount)} has been rejected. Reason: ${data.rejectionReason}`,
      },
    };

    const { subject, message } = statusMessages[data.status];

    console.log("📧 Withdrawal Notification:", {
      to: data.userEmail,
      subject,
      message,
    });

    await this.storeNotification({
      userEmail: data.userEmail,
      type: "WITHDRAWAL",
      title: subject,
      message,
      metadata: data,
    });
  },

  /**
   * Send payout notification
   */
  async sendPayoutNotification(data: PayoutNotificationData): Promise<void> {
    console.log("📧 Payout Notification:", {
      to: data.userEmail,
      subject: `Monthly Payout - ${data.month}`,
      message: `Your payout of ₹${this.formatCurrency(data.amount)} for ${data.month} has been processed.`,
    });

    await this.storeNotification({
      userEmail: data.userEmail,
      type: "PAYOUT",
      title: `Payout Received - ${data.month}`,
      message: `₹${this.formatCurrency(data.amount)} has been credited to your account.`,
      metadata: data,
    });
  },

  /**
   * Store notification in database for in-app display
   */
  async storeNotification(notification: {
    userEmail: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }): Promise<void> {
    try {
      // Get user ID from email
      const { data: user } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", notification.userEmail)
        .single();

      if (!user) {
        console.error("User not found:", notification.userEmail);
        return;
      }

      // Insert notification
      const { error } = await supabase.from("notifications").insert({
        user_id: user.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        metadata: notification.metadata,
        read: false,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Failed to store notification:", error);
    }
  },

  /**
   * Utility: Format currency
   */
  formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)} L`;
    }
    return amount.toLocaleString("en-IN");
  },

  /**
   * Utility: Get next rank name
   */
  getNextRank(currentRank: string): string {
    const ranks = ["BASE", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "AMBASSADOR"];
    const currentIndex = ranks.indexOf(currentRank);
    return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : "MAX";
  },
};