/**
 * System Health Dashboard Widget
 * Displays real-time system health status for Super Admin
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Mail,
  Download
} from "lucide-react";
import { healthMonitor, SystemHealthReport } from "@/lib/monitoring/health-check";
import { monitoringEmail } from "@/lib/email/monitoring-reports";
import { useToast } from "@/hooks/use-toast";

export function SystemHealthWidget() {
  const { toast } = useToast();
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    runHealthCheck();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      runHealthCheck();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const newReport = await healthMonitor.runFullHealthCheck();
      setReport(newReport);
      setLastCheck(new Date());

      // Auto-send email if critical issues detected
      if (newReport.summary.critical > 0) {
        await monitoringEmail.sendHealthReport(newReport);
        toast({
          variant: "destructive",
          title: "Critical Issues Detected",
          description: `${newReport.summary.critical} critical issue(s) found. Email sent to admin.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Health Check Failed",
        description: "Unable to complete system health check",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailReport = async () => {
    if (!report) return;

    try {
      await monitoringEmail.sendHealthReport(report);
      toast({
        title: "Email Sent",
        description: `Health report sent to akadevapp7@gmail.com`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Email Failed",
        description: "Unable to send email report",
      });
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const textReport = healthMonitor.formatReportAsText(report);
    const blob = new Blob([textReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health-report-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!report) {
    return (
      <Card className="bg-slate-900/60 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health Monitor
          </CardTitle>
          <CardDescription>Loading health status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusColor =
    report.overallStatus === "healthy"
      ? "text-green-500"
      : report.overallStatus === "degraded"
      ? "text-yellow-500"
      : "text-red-500";

  const statusIcon =
    report.overallStatus === "healthy" ? (
      <CheckCircle2 className={`w-6 h-6 ${statusColor}`} />
    ) : report.overallStatus === "degraded" ? (
      <AlertTriangle className={`w-6 h-6 ${statusColor}`} />
    ) : (
      <XCircle className={`w-6 h-6 ${statusColor}`} />
    );

  return (
    <Card className="bg-slate-900/60 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health Monitor
            </CardTitle>
            <CardDescription>
              Last check: {lastCheck?.toLocaleTimeString() || "Never"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={runHealthCheck}
              disabled={isLoading}
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={sendEmailReport}
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={downloadReport}
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            {statusIcon}
            <div>
              <p className="text-sm text-slate-400">Overall Status</p>
              <p className={`text-lg font-semibold ${statusColor}`}>
                {report.overallStatus.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">{report.summary.healthy}</p>
              <p className="text-xs text-slate-400">Healthy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{report.summary.warning}</p>
              <p className="text-xs text-slate-400">Warnings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{report.summary.critical}</p>
              <p className="text-xs text-slate-400">Critical</p>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {report.checks
          .filter((c) => c.status === "critical")
          .map((check, idx) => (
            <Alert key={idx} variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{check.component}</AlertTitle>
              <AlertDescription>
                {check.message}
                {check.resolution && (
                  <div className="mt-2 p-2 bg-slate-800 rounded text-sm">
                    <strong>Resolution:</strong> {check.resolution}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ))}

        {/* Component Status List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {report.checks.map((check, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {check.status === "healthy" && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                {check.status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                {check.status === "critical" && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{check.component}</p>
                  <p className="text-xs text-slate-400 truncate">{check.message}</p>
                </div>
              </div>
              <Badge
                variant={
                  check.status === "healthy"
                    ? "default"
                    : check.status === "warning"
                    ? "secondary"
                    : "destructive"
                }
                className="flex-shrink-0"
              >
                {check.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-500 mb-2">💡 Recommendations</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              {report.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}