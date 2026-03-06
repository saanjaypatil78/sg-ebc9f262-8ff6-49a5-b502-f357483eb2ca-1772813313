import { supabase } from "@/integrations/supabase/client";

const SUPER_ADMIN_EMAIL = "007saanjaypatil@gmail.com";

interface EmailNotification {
  to: string[];
  subject: string;
  html: string;
  cc?: string[];
}

export const emailService = {
  /**
   * Send rank upgrade notification
   * Notifies: User + Upline + Super Admin
   */
  async sendRankUpgradeNotification(
    userId: string, 
    newRank: string, 
    oldRank: string
  ) {
    try {
      // Get user details
      const { data: user } = await supabase
        .from('profiles')
        .select('email, first_name, last_name, referral_code')
        .eq('id', userId)
        .single();

      if (!user) throw new Error('User not found');

      // Get upline details (if exists)
      const { data: referral } = await supabase
        .from('referral_tree')
        .select('referrer_id, profiles!referrer_id(email, first_name)')
        .eq('user_id', userId)
        .single();

      const recipients = [user.email];
      const ccList = [SUPER_ADMIN_EMAIL];

      if (referral?.profiles?.email) {
        ccList.push(referral.profiles.email);
      }

      const emailData: EmailNotification = {
        to: recipients,
        cc: ccList,
        subject: `🎉 Congratulations! You've Upgraded to ${newRank} Rank`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px;">
            <div style="background: white; padding: 40px; border-radius: 12px;">
              <h1 style="color: #667eea; margin-bottom: 20px;">🎉 Rank Upgrade Achievement!</h1>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Dear ${user.first_name} ${user.last_name},
              </p>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Congratulations! You have successfully upgraded from <strong>${oldRank}</strong> to <strong style="color: #667eea;">${newRank}</strong> rank in the Brave Ecom ecosystem.
              </p>
              
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-bottom: 10px;">Your New Benefits:</h3>
                <ul style="color: #333; line-height: 1.8;">
                  ${this.getRankBenefits(newRank)}
                </ul>
              </div>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Your Referral Code: <strong style="color: #667eea;">${user.referral_code}</strong>
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Keep up the excellent work! Your success is our success.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                Brave Ecom - India's Most Transparent Investment Ecosystem<br/>
                Questions? Reply to this email or contact support.
              </p>
            </div>
          </div>
        `
      };

      // Store notification in database
      await supabase
        .from('email_notifications')
        .insert({
          user_id: userId,
          email_type: 'rank_upgrade',
          subject: emailData.subject,
          sent_to: emailData.to,
          cc: emailData.cc,
          status: 'pending'
        });

      console.log('Rank upgrade email queued:', emailData);
      
      // In production, integrate with SendGrid/AWS SES
      // await sendEmail(emailData);

      return { success: true };
    } catch (error) {
      console.error('Failed to send rank upgrade email:', error);
      throw error;
    }
  },

  /**
   * Send Orange rank activation alert to Super Admin
   */
  async sendOrangeRankAlert(userId: string) {
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('email, first_name, last_name, id, investment_amount')
        .eq('id', userId)
        .single();

      if (!user) throw new Error('User not found');

      const emailData: EmailNotification = {
        to: [SUPER_ADMIN_EMAIL],
        subject: `⚠️ Orange Rank Activation Required - ${user.first_name} ${user.last_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px; border-radius: 16px;">
            <div style="background: white; padding: 40px; border-radius: 12px;">
              <h1 style="color: #f97316; margin-bottom: 20px;">⚠️ Orange Rank Activation Required</h1>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                A new investor has completed their investment and is eligible for Orange rank activation.
              </p>
              
              <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
                <h3 style="color: #f97316; margin-bottom: 10px;">Investor Details:</h3>
                <table style="width: 100%; color: #333;">
                  <tr>
                    <td style="padding: 5px 0;"><strong>Name:</strong></td>
                    <td style="padding: 5px 0;">${user.first_name} ${user.last_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>Email:</strong></td>
                    <td style="padding: 5px 0;">${user.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>User ID:</strong></td>
                    <td style="padding: 5px 0;"><code>${user.id}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>Investment:</strong></td>
                    <td style="padding: 5px 0;">₹${user.investment_amount?.toLocaleString('en-IN')}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                <strong>Action Required:</strong> Please activate this user's Orange rank status via the admin dashboard.
              </p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/admin/users" 
                 style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold;">
                Activate Now
              </a>
            </div>
          </div>
        `
      };

      await supabase
        .from('email_notifications')
        .insert({
          user_id: userId,
          email_type: 'orange_rank_alert',
          subject: emailData.subject,
          sent_to: emailData.to,
          status: 'pending'
        });

      console.log('Orange rank alert queued for Super Admin');
      return { success: true };
    } catch (error) {
      console.error('Failed to send Orange rank alert:', error);
      throw error;
    }
  },

  /**
   * Send commission milestone notification
   */
  async sendCommissionMilestone(userId: string, milestone: number) {
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single();

      if (!user) throw new Error('User not found');

      const emailData: EmailNotification = {
        to: [user.email],
        subject: `🎯 Milestone Achieved: ₹${(milestone / 10000000).toFixed(1)} Crore Commission!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; border-radius: 16px;">
            <div style="background: white; padding: 40px; border-radius: 12px;">
              <h1 style="color: #10b981; margin-bottom: 20px;">🎯 Milestone Achievement!</h1>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Dear ${user.first_name},
              </p>
              
              <p style="font-size: 18px; color: #333; line-height: 1.6; font-weight: bold;">
                You've reached ₹${(milestone / 10000000).toFixed(1)} Crore in total commission earnings!
              </p>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                This is a remarkable achievement. Keep building your network and watch your earnings grow exponentially.
              </p>
            </div>
          </div>
        `
      };

      await supabase
        .from('email_notifications')
        .insert({
          user_id: userId,
          email_type: 'commission_milestone',
          subject: emailData.subject,
          sent_to: emailData.to,
          status: 'pending'
        });

      return { success: true };
    } catch (error) {
      console.error('Failed to send milestone email:', error);
      throw error;
    }
  },

  getRankBenefits(rank: string): string {
    const benefits: Record<string, string[]> = {
      'grey': ['Access to platform', 'Investment pending'],
      'orange': ['Active investor status', '15% monthly returns', 'Referral commissions enabled'],
      'bronze': ['₹1 Cr commission milestone', 'Enhanced commission rates', 'Priority support'],
      'dark_green': ['Veteran investor (2+ years)', 'Maximum commission tier', 'VIP benefits']
    };

    return (benefits[rank] || ['Enhanced platform benefits'])
      .map(b => `<li>${b}</li>`)
      .join('');
  }
};