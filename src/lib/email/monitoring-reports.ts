/**
 * Email Notification Service for System Health Monitoring
 */

import { SystemHealthReport } from "../monitoring/health-check";

export const ADMIN_EMAIL = "akadevapp7@gmail.com";

export interface EmailReport {
  to: string;
  subject: string;
  body: string;
  priority: "high" | "normal" | "low";
}

export class MonitoringEmailService {
  /**
   * Send health report via email
   */
  async sendHealthReport(report: SystemHealthReport): Promise<boolean> {
    try {
      const email = this.formatHealthReportEmail(report);

      // In production, this would integrate with your email service
      // For now, we'll log and return success
      console.log("📧 Health Report Email:", email);

      // TODO: Integrate with actual email service (SendGrid, Resend, etc.)
      // Example:
      // await fetch('/api/email/send', {
      //   method: 'POST',
      //   body: JSON.stringify(email)
      // });

      return true;
    } catch (error) {
      console.error("Failed to send health report email:", error);
      return false;
    }
  }

  /**
   * Format health report as email
   */
  private formatHealthReportEmail(report: SystemHealthReport): EmailReport {
    const priority =
      report.overallStatus === "critical"
        ? "high"
        : report.overallStatus === "degraded"
        ? "normal"
        : "low";

    const statusIcon =
      report.overallStatus === "healthy"
        ? "✅"
        : report.overallStatus === "degraded"
        ? "⚠️"
        : "🔴";

    const subject = `${statusIcon} System Health Report - ${report.overallStatus.toUpperCase()} - ${new Date(
      report.timestamp
    ).toLocaleString()}`;

    const body = this.buildEmailBody(report);

    return {
      to: ADMIN_EMAIL,
      subject,
      body,
      priority,
    };
  }

  /**
   * Build detailed email body
   */
  private buildEmailBody(report: SystemHealthReport): string {
    const criticalIssues = report.checks.filter((c) => c.status === "critical");
    const warnings = report.checks.filter((c) => c.status === "warning");
    const healthy = report.checks.filter((c) => c.status === "healthy");

    let html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .status-healthy { background: #10b981; color: white; }
    .status-degraded { background: #f59e0b; color: white; }
    .status-critical { background: #ef4444; color: white; }
    .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .check-item { padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid; }
    .check-healthy { background: #d1fae5; border-color: #10b981; }
    .check-warning { background: #fef3c7; border-color: #f59e0b; }
    .check-critical { background: #fee2e2; border-color: #ef4444; }
    .metrics { background: #f9fafb; padding: 10px; border-radius: 5px; margin-top: 10px; font-size: 0.9em; }
    .resolution { background: #e0e7ff; padding: 10px; border-radius: 5px; margin-top: 10px; font-weight: 500; }
    .recommendations { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #fbbf24; }
    .footer { text-align: center; color: #6b7280; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 Autonomous System Health Report</h1>
      <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
      <div class="status-badge status-${report.overallStatus}">
        ${report.overallStatus.toUpperCase()}
      </div>
    </div>

    <div class="summary">
      <h2>📊 Executive Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px;"><strong>Total Checks:</strong></td>
          <td style="padding: 10px;">${report.summary.total}</td>
        </tr>
        <tr>
          <td style="padding: 10px;"><strong>✅ Healthy:</strong></td>
          <td style="padding: 10px;">${report.summary.healthy}</td>
        </tr>
        <tr>
          <td style="padding: 10px;"><strong>🟡 Warnings:</strong></td>
          <td style="padding: 10px;">${report.summary.warning}</td>
        </tr>
        <tr>
          <td style="padding: 10px;"><strong>🔴 Critical:</strong></td>
          <td style="padding: 10px;">${report.summary.critical}</td>
        </tr>
      </table>
    </div>
`;

    // Critical Issues Section
    if (criticalIssues.length > 0) {
      html += `
    <div style="margin: 30px 0;">
      <h2>🔴 Critical Issues (Immediate Attention Required)</h2>
`;
      criticalIssues.forEach((check) => {
        html += `
      <div class="check-item check-critical">
        <h3>${check.component}</h3>
        <p><strong>Issue:</strong> ${check.message}</p>
        ${check.metrics ? `<div class="metrics"><strong>Metrics:</strong><pre>${JSON.stringify(check.metrics, null, 2)}</pre></div>` : ""}
        ${check.resolution ? `<div class="resolution"><strong>🔧 Resolution:</strong> ${check.resolution}</div>` : ""}
        <p style="font-size: 0.9em; color: #6b7280; margin-top: 10px;">Timestamp: ${new Date(check.timestamp).toLocaleString()}</p>
      </div>
`;
      });
      html += `</div>`;
    }

    // Warnings Section
    if (warnings.length > 0) {
      html += `
    <div style="margin: 30px 0;">
      <h2>🟡 Warnings (Should Be Reviewed)</h2>
`;
      warnings.forEach((check) => {
        html += `
      <div class="check-item check-warning">
        <h3>${check.component}</h3>
        <p><strong>Warning:</strong> ${check.message}</p>
        ${check.metrics ? `<div class="metrics"><strong>Metrics:</strong><pre>${JSON.stringify(check.metrics, null, 2)}</pre></div>` : ""}
        ${check.resolution ? `<div class="resolution"><strong>🔧 Resolution:</strong> ${check.resolution}</div>` : ""}
        <p style="font-size: 0.9em; color: #6b7280; margin-top: 10px;">Timestamp: ${new Date(check.timestamp).toLocaleString()}</p>
      </div>
`;
      });
      html += `</div>`;
    }

    // Healthy Systems Section
    if (healthy.length > 0) {
      html += `
    <div style="margin: 30px 0;">
      <h2>✅ Healthy Systems</h2>
`;
      healthy.forEach((check) => {
        html += `
      <div class="check-item check-healthy">
        <h3>${check.component}</h3>
        <p>${check.message}</p>
        ${check.metrics ? `<div class="metrics"><pre>${JSON.stringify(check.metrics, null, 2)}</pre></div>` : ""}
      </div>
`;
      });
      html += `</div>`;
    }

    // Recommendations
    html += `
    <div class="recommendations">
      <h2>💡 Recommendations</h2>
      <ul>
`;
    report.recommendations.forEach((rec) => {
      html += `<li>${rec}</li>`;
    });
    html += `
      </ul>
    </div>

    <div class="footer">
      <p><strong>Brave Ecom - Autonomous Monitoring System</strong></p>
      <p>This is an automated report. For support, reply to this email or contact: akadevapp7@gmail.com</p>
      <p style="font-size: 0.9em; color: #9ca3af;">Generated by Health Monitor v1.0</p>
    </div>
  </div>
</body>
</html>
`;

    return html;
  }

  /**
   * Send immediate alert for critical issues
   */
  async sendCriticalAlert(component: string, message: string, resolution?: string): Promise<boolean> {
    try {
      const email: EmailReport = {
        to: ADMIN_EMAIL,
        subject: `🚨 CRITICAL ALERT: ${component} - ${new Date().toLocaleString()}`,
        body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background: #fee2e2; border: 2px solid #ef4444; padding: 20px; border-radius: 10px; }
    .resolution { background: #dbeafe; padding: 15px; border-radius: 5px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="alert">
      <h1>🚨 CRITICAL SYSTEM ALERT</h1>
      <p><strong>Component:</strong> ${component}</p>
      <p><strong>Issue:</strong> ${message}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      ${resolution ? `<div class="resolution"><strong>🔧 Recommended Action:</strong><br>${resolution}</div>` : ""}
    </div>
    <p style="margin-top: 20px; color: #6b7280; text-align: center;">
      This is an automated critical alert from Brave Ecom monitoring system.
    </p>
  </div>
</body>
</html>
        `,
        priority: "high",
      };

      console.log("🚨 Critical Alert Email:", email);
      return true;
    } catch (error) {
      console.error("Failed to send critical alert:", error);
      return false;
    }
  }
}

// Export singleton
export const monitoringEmail = new MonitoringEmailService();