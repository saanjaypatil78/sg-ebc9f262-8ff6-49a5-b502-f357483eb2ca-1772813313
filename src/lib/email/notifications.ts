/**
 * Email Notification Service
 * Auto-alert system for user actions
 */

export interface EmailConfig {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface NotificationTemplate {
  welcome: (name: string, email: string) => EmailConfig;
  investmentConfirmed: (name: string, amount: number, tier: string) => EmailConfig;
  payoutProcessed: (name: string, amount: number, month: string) => EmailConfig;
  rankUpgrade: (name: string, oldRank: string, newRank: string) => EmailConfig;
  securityAlert: (name: string, action: string, ip: string) => EmailConfig;
  twoFactorEnabled: (name: string) => EmailConfig;
  deviceAdded: (name: string, deviceName: string) => EmailConfig;
  passwordReset: (name: string, resetLink: string) => EmailConfig;
  loginAlert: (name: string, location: string, device: string) => EmailConfig;
}

const BRANDING = {
  companyName: 'Brave Ecom (Sunray Ecosystem)',
  supportEmail: 'support@bravecom.info',
  websiteUrl: 'https://bravecom.info',
  logoUrl: 'https://bravecom.info/bravecom-logo-hex.png',
};

/**
 * Email Templates
 */
export const emailTemplates: NotificationTemplate = {
  /**
   * Welcome Email (Registration)
   */
  welcome: (name: string, email: string) => ({
    to: email,
    subject: `Welcome to ${BRANDING.companyName}! 🎉`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${BRANDING.companyName}!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for registering with us! Your account has been successfully created.</p>
            <p>You're now part of an exclusive investment ecosystem with:</p>
            <ul>
              <li>✅ 15% monthly returns</li>
              <li>✅ Complete transparency</li>
              <li>✅ Bank-grade security</li>
              <li>✅ 184+ active investors</li>
            </ul>
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Complete your KYC verification</li>
              <li>Choose your investment tier</li>
              <li>Start earning passive income!</li>
            </ol>
            <a href="${BRANDING.websiteUrl}/dashboard/investor" class="button">Go to Dashboard</a>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}<br/>
            Email: ${BRANDING.supportEmail}<br/>
            Website: ${BRANDING.websiteUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `Welcome to ${BRANDING.companyName}, ${name}!\n\nYour account has been successfully created. Visit ${BRANDING.websiteUrl}/dashboard/investor to get started.`,
  }),

  /**
   * Investment Confirmation
   */
  investmentConfirmed: (name: string, amount: number, tier: string) => ({
    to: '',
    subject: `✅ Investment Confirmed - ₹${(amount / 100000).toFixed(2)} Lakh`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 6px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Investment Confirmed!</h1>
          </div>
          <div class="content">
            <p>Congratulations <strong>${name}</strong>,</p>
            <p>Your investment has been successfully processed and confirmed!</p>
            <div class="highlight">
              <p><strong>Investment Details:</strong></p>
              <ul>
                <li><strong>Amount:</strong> ₹${(amount / 100000).toFixed(2)} Lakh</li>
                <li><strong>Tier:</strong> ${tier}</li>
                <li><strong>Expected Monthly Return:</strong> ₹${(amount * 0.15 / 100000).toFixed(2)} Lakh (15%)</li>
                <li><strong>First Payout:</strong> 45 days from today</li>
                <li><strong>Subsequent Payouts:</strong> Every 30 days</li>
              </ul>
            </div>
            <p><strong>What happens next?</strong></p>
            <ol>
              <li>Your investment is now active</li>
              <li>Returns will be calculated monthly</li>
              <li>Track your portfolio in the dashboard</li>
              <li>Refer friends to boost your rank!</li>
            </ol>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}<br/>
            Support: ${BRANDING.supportEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `Investment Confirmed!\n\nAmount: ₹${(amount / 100000).toFixed(2)} Lakh\nTier: ${tier}\nExpected Monthly Return: ₹${(amount * 0.15 / 100000).toFixed(2)} Lakh`,
  }),

  /**
   * Payout Processed
   */
  payoutProcessed: (name: string, amount: number, month: string) => ({
    to: '',
    subject: `💰 Payout Processed - ₹${(amount / 100000).toFixed(2)} Lakh`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .amount { font-size: 36px; color: #10b981; font-weight: bold; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Payout Processed!</h1>
          </div>
          <div class="content">
            <p>Great news, <strong>${name}</strong>!</p>
            <p>Your ${month} payout has been successfully processed.</p>
            <div class="amount">₹${(amount / 100000).toFixed(2)} Lakh</div>
            <p>The amount will be credited to your registered bank account within 2-3 business days.</p>
            <p><strong>Payment Details:</strong></p>
            <ul>
              <li>Period: ${month}</li>
              <li>Amount: ₹${amount.toLocaleString('en-IN')}</li>
              <li>Status: Processed ✅</li>
            </ul>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}<br/>
            Questions? Contact: ${BRANDING.supportEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `Payout Processed!\n\nAmount: ₹${(amount / 100000).toFixed(2)} Lakh\nPeriod: ${month}\nStatus: Processed ✅`,
  }),

  /**
   * Rank Upgrade
   */
  rankUpgrade: (name: string, oldRank: string, newRank: string) => ({
    to: '',
    subject: `🏆 Rank Upgraded: ${newRank}!`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .rank-badge { font-size: 48px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Congratulations!</h1>
          </div>
          <div class="content">
            <p>Amazing work, <strong>${name}</strong>!</p>
            <p>You've achieved a new rank in the Sunray Ecosystem!</p>
            <div class="rank-badge">
              ${oldRank} → <span style="color: #f59e0b;">${newRank}</span>
            </div>
            <p><strong>Benefits of ${newRank} Rank:</strong></p>
            <ul>
              <li>✅ Higher commission percentages</li>
              <li>✅ Exclusive bonuses</li>
              <li>✅ Priority support</li>
              <li>✅ Special recognition</li>
            </ul>
            <p>Keep growing your network to unlock even more rewards!</p>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}<br/>
            Celebrate: ${BRANDING.supportEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `Rank Upgraded!\n\n${oldRank} → ${newRank}\n\nCongratulations ${name}! You've unlocked new benefits.`,
  }),

  /**
   * Security Alert
   */
  securityAlert: (name: string, action: string, ip: string) => ({
    to: '',
    subject: `🔒 Security Alert: ${action}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert { background: #fee2e2; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; border-radius: 6px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Security Alert</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <div class="alert">
              <p><strong>Security Action Detected:</strong></p>
              <ul>
                <li><strong>Action:</strong> ${action}</li>
                <li><strong>IP Address:</strong> ${ip}</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            <p><strong>Was this you?</strong></p>
            <p>If you recognize this activity, you can safely ignore this email.</p>
            <p>If you did NOT perform this action, please:</p>
            <ol>
              <li>Change your password immediately</li>
              <li>Enable 2FA if not already active</li>
              <li>Contact support: ${BRANDING.supportEmail}</li>
            </ol>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}<br/>
            Security Team: ${BRANDING.supportEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `Security Alert!\n\nAction: ${action}\nIP: ${ip}\n\nIf this wasn't you, contact support immediately.`,
  }),

  /**
   * 2FA Enabled
   */
  twoFactorEnabled: (name: string) => ({
    to: '',
    subject: '✅ Two-Factor Authentication Enabled',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ 2FA Enabled!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Two-Factor Authentication has been successfully enabled on your account.</p>
            <p><strong>Enhanced Security Active:</strong></p>
            <ul>
              <li>✅ TOTP-based verification</li>
              <li>✅ Google Authenticator compatible</li>
              <li>✅ Backup codes generated</li>
              <li>✅ Login protection enhanced</li>
            </ul>
            <p>Your account is now significantly more secure!</p>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `2FA Enabled!\n\nYour account security has been enhanced with Two-Factor Authentication.`,
  }),

  /**
   * Device Added
   */
  deviceAdded: (name: string, deviceName: string) => ({
    to: '',
    subject: '📱 New Device Added to Your Account',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📱 New Device Added</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>A new device has been added to your trusted devices:</p>
            <p><strong>Device:</strong> ${deviceName}</p>
            <p>This device is now authorized for high-value transactions.</p>
            <p>If you did not add this device, please remove it immediately from your security settings.</p>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `New Device Added\n\nDevice: ${deviceName}\n\nIf this wasn't you, remove it from security settings.`,
  }),

  /**
   * Password Reset
   */
  passwordReset: (name: string, resetLink: string) => ({
    to: '',
    subject: '🔑 Password Reset Request',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this, ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}<br/>
            Support: ${BRANDING.supportEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `Password Reset Request\n\nClick here to reset: ${resetLink}\n\nExpires in 1 hour.`,
  }),

  /**
   * Login Alert
   */
  loginAlert: (name: string, location: string, device: string) => ({
    to: '',
    subject: '🔔 New Login Detected',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Login Detected</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>A new login to your account was detected:</p>
            <ul>
              <li><strong>Location:</strong> ${location}</li>
              <li><strong>Device:</strong> ${device}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <p>If this was you, you can safely ignore this email.</p>
            <p>If you don't recognize this activity, secure your account immediately.</p>
          </div>
          <div class="footer">
            <p>${BRANDING.companyName}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `New Login Detected\n\nLocation: ${location}\nDevice: ${device}\nTime: ${new Date().toLocaleString()}`,
  }),
};

/**
 * Send Email Function (Integration point for email service)
 */
export async function sendEmail(config: EmailConfig): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Integrate with email service provider (SendGrid, Resend, etc.)
    // For now, just log the email
    console.log('📧 Email Notification:', {
      to: config.to,
      subject: config.subject,
      preview: config.textContent.substring(0, 100),
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Auto-trigger email notifications based on events
 */
export const emailNotificationService = {
  async onUserRegistered(userId: string, email: string, name: string) {
    const emailConfig = emailTemplates.welcome(name, email);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async onInvestmentConfirmed(userId: string, email: string, name: string, amount: number, tier: string) {
    const emailConfig = emailTemplates.investmentConfirmed(name, amount, tier);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async onPayoutProcessed(userId: string, email: string, name: string, amount: number, month: string) {
    const emailConfig = emailTemplates.payoutProcessed(name, amount, month);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async onRankUpgrade(userId: string, email: string, name: string, oldRank: string, newRank: string) {
    const emailConfig = emailTemplates.rankUpgrade(name, oldRank, newRank);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async onSecurityAlert(userId: string, email: string, name: string, action: string, ip: string) {
    const emailConfig = emailTemplates.securityAlert(name, action, ip);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async on2FAEnabled(userId: string, email: string, name: string) {
    const emailConfig = emailTemplates.twoFactorEnabled(name);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async onDeviceAdded(userId: string, email: string, name: string, deviceName: string) {
    const emailConfig = emailTemplates.deviceAdded(name, deviceName);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async onPasswordReset(userId: string, email: string, name: string, resetLink: string) {
    const emailConfig = emailTemplates.passwordReset(name, resetLink);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },

  async onLogin(userId: string, email: string, name: string, location: string, device: string) {
    const emailConfig = emailTemplates.loginAlert(name, location, device);
    emailConfig.to = email;
    await sendEmail(emailConfig);
  },
};