import { useState, useEffect } from "react";
import { Shield, Users, Activity, AlertTriangle, Lock, Eye, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SecurityAlert {
  id: string;
  type: 'FAILED_LOGIN' | 'SUSPICIOUS_IP' | 'DEVICE_CHANGE' | 'HIGH_VALUE_TX';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeSessions: 0,
    failedLogins24h: 0,
    users2FAEnabled: 0,
    highValueInvestors: 0,
    devicesRegistered: 0,
    suspiciousActivity: 0,
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load stats
      const { data: users } = await (supabase.from("users") as any).select("*");
      const { data: sessions } = await (supabase.from("active_sessions") as any).select("*");
      const { data: devices } = await (supabase.from("trusted_devices") as any).select("*");
      const { data: failedLogins } = await (supabase.from("login_history") as any)
        .from('login_history')
        .select('*')
        .eq('success', false)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      setStats({
        totalUsers: users?.length || 0,
        activeUsers: users?.filter((u: any) => u.status === "GREEN").length || 0,
        activeSessions: sessions?.length || 0,
        failedLogins24h: failedLogins?.length || 0,
        users2FAEnabled: users?.filter(u => u.two_factor_enabled).length || 0,
        highValueInvestors: users?.filter(u => u.investment_amount >= 50000000).length || 0,
        devicesRegistered: devices?.length || 0,
        suspiciousActivity: 0,
      });

      // Load security alerts (mock for now)
      setAlerts([
        {
          id: '1',
          type: 'FAILED_LOGIN',
          severity: 'MEDIUM',
          userId: 'user1',
          userName: 'John Doe',
          message: '5 failed login attempts from 192.168.1.1',
          timestamp: new Date().toISOString(),
          resolved: false,
        },
        {
          id: '2',
          type: 'DEVICE_CHANGE',
          severity: 'HIGH',
          userId: 'user2',
          userName: 'Jane Smith',
          message: 'New device registered for high-value account',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          resolved: false,
        },
      ]);
    } catch (error) {
      console.error("Failed to load security data:", error);
      toast({
        title: "Error",
        description: "Failed to load security dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, resolved: true } : a
    ));
    
    toast({
      title: "Alert Resolved",
      description: "Security alert has been marked as resolved",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'HIGH': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'MEDIUM': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'FAILED_LOGIN': return <XCircle className="w-5 h-5" />;
      case 'DEVICE_CHANGE': return <Activity className="w-5 h-5" />;
      case 'SUSPICIOUS_IP': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
          <p className="text-slate-400">Monitor platform security and user activity</p>
        </div>

        {/* Security Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
              <Users className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-slate-500">{stats.activeUsers} active</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Sessions</CardTitle>
              <Activity className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeSessions}</div>
              <p className="text-xs text-slate-500">Currently logged in</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">2FA Enabled</CardTitle>
              <Lock className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.users2FAEnabled}</div>
              <p className="text-xs text-slate-500">
                {Math.round((stats.users2FAEnabled / stats.totalUsers) * 100)}% adoption
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-400">Failed Logins (24h)</CardTitle>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.failedLogins24h}</div>
              <p className="text-xs text-amber-400">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Security Tabs */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="policies">ABAC Policies</TabsTrigger>
            <TabsTrigger value="devices">Trusted Devices</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Security Alerts</CardTitle>
                <CardDescription>Real-time security events requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-400 text-center py-8">Loading alerts...</p>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-slate-400">No active security alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.filter(a => !a.resolved).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/50"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{alert.userName}</h3>
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{alert.message}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="bg-green-500/10 border-green-500/20 hover:bg-green-500/20 text-green-400"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">ABAC Security Policies</CardTitle>
                <CardDescription>Active attribute-based access control rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">High-Value Device Binding</h3>
                      <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      Requires device registration for investors with ≥ ₹5 Crore investment
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">Business Hours Only</h3>
                      <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      Restricts high-value operations to 9:00 AM - 6:00 PM IST
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">Transaction Amount Limit</h3>
                      <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      Requires dual approval for transactions ≥ ₹1 Crore
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Trusted Devices Overview</CardTitle>
                <CardDescription>Devices registered for high-value accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
                    <p className="text-sm text-slate-400 mb-1">Total Devices</p>
                    <p className="text-2xl font-bold text-white">{stats.devicesRegistered}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
                    <p className="text-sm text-slate-400 mb-1">High-Value Accounts</p>
                    <p className="text-2xl font-bold text-white">{stats.highValueInvestors}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
                    <p className="text-sm text-slate-400 mb-1">Compliance Rate</p>
                    <p className="text-2xl font-bold text-green-400">
                      {stats.highValueInvestors > 0 
                        ? Math.round((stats.devicesRegistered / stats.highValueInvestors) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Audit Trail</CardTitle>
                <CardDescription>Complete security event history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-center py-8">
                  Full audit log integration coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}