/**
 * API Endpoint for Health Checks
 * Can be called by Vercel Cron Jobs for scheduled monitoring
 */

import { NextApiRequest, NextApiResponse } from "next";
import { healthMonitor } from "@/lib/monitoring/health-check";
import { monitoringEmail } from "@/lib/email/monitoring-reports";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: Add API key authentication for security
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.HEALTH_CHECK_TOKEN || "your-secret-token";

  if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Run full health check
    const report = await healthMonitor.runFullHealthCheck();

    // Send email if critical issues detected
    if (report.summary.critical > 0) {
      await monitoringEmail.sendHealthReport(report);
    }

    // Return report
    return res.status(200).json({
      success: true,
      report,
      emailSent: report.summary.critical > 0,
    });
  } catch (error) {
    console.error("Health check API error:", error);
    return res.status(500).json({
      success: false,
      error: "Health check failed",
    });
  }
}