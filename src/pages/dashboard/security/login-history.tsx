import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";

export default function LoginHistoryPage() {
  const { toast } = useToast();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoginHistory();
  }, []);

  const loadLoginHistory = async () => {
    const user = authService.getSession();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("login_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load login history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Login History</h1>
          <p className="text-slate-400">Review your recent login activity</p>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6 text-center text-slate-400">
                Loading history...
              </CardContent>
            </Card>
          ) : history.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6 text-center text-slate-400">
                No login history found
              </CardContent>
            </Card>
          ) : (
            history.map((entry) => (
              <Card key={entry.id} className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      entry.success 
                        ? "bg-green-500/10" 
                        : "bg-red-500/10"
                    }`}>
                      {entry.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={
                          entry.success
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }>
                          {entry.event_type}
                        </Badge>
                        {entry.success ? (
                          <span className="text-slate-400 text-sm">Successful</span>
                        ) : (
                          <span className="text-red-400 text-sm">Failed</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(entry.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{entry.ip_address}</span>
                        </div>
                      </div>
                      
                      {entry.user_agent && (
                        <p className="text-xs text-slate-500 mt-2">{entry.user_agent}</p>
                      )}
                    </div>
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