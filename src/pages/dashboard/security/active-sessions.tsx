import { useState, useEffect } from "react";
import { Monitor, Smartphone, X, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { sessionManagementService } from "@/lib/security/session-management-service";
import { authService } from "@/services/authService";

export default function ActiveSessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const user = authService.getSession();
    if (!user) return;

    try {
      const activeSessions = await sessionManagementService.getActiveSessions(user.id);
      setSessions(activeSessions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load active sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      await sessionManagementService.terminateSession(sessionId);
      toast({
        title: "Session Terminated",
        description: "The session has been logged out",
      });
      loadSessions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
  };

  const terminateAllOthers = async () => {
    const user = authService.getSession();
    if (!user) return;

    try {
      await sessionManagementService.terminateOtherSessions(user.id, "current");
      toast({
        title: "All Other Sessions Terminated",
        description: "You've been logged out from all other devices",
      });
      loadSessions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate sessions",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Active Sessions</h1>
          <p className="text-slate-400">Manage devices logged into your account</p>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <div className="flex-1">
            <p className="text-amber-400 font-semibold">Security Alert</p>
            <p className="text-slate-400 text-sm">
              If you see any suspicious sessions, terminate them immediately and change your password.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={terminateAllOthers}
            className="bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-400"
          >
            <X className="w-4 h-4 mr-2" />
            Logout All Others
          </Button>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6 text-center text-slate-400">
                Loading sessions...
              </CardContent>
            </Card>
          ) : sessions.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6 text-center text-slate-400">
                No active sessions found
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      {session.device_info?.browser?.includes("Mobile") ? (
                        <Smartphone className="w-6 h-6 text-white" />
                      ) : (
                        <Monitor className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">
                          {session.device_info?.browser || "Unknown Browser"} on {session.device_info?.os || "Unknown OS"}
                        </h3>
                        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-slate-400">
                        <p>IP Address: {session.ip_address}</p>
                        <p>Last Activity: {new Date(session.last_activity).toLocaleString()}</p>
                        <p>Expires: {new Date(session.expires_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => terminateSession(session.id)}
                      className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Terminate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}