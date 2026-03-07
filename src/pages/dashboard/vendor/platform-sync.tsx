import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { platformSyncService } from "@/services/platformSyncService";
import {
  RefreshCw,
  Plus,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Package,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PlatformSyncPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newIntegration, setNewIntegration] = useState({
    platformName: "",
    storeId: "",
    apiKey: "",
    apiSecret: "",
    syncFrequency: "hourly",
  });

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedIntegration) {
      loadSyncLogs(selectedIntegration);
    }
  }, [selectedIntegration]);

  const loadIntegrations = async () => {
    try {
      setIsLoading(true);
      const data = await platformSyncService.getVendorIntegrations(user!.id);
      setIntegrations(data);
      if (data.length > 0 && !selectedIntegration) {
        setSelectedIntegration(data[0].id);
      }
    } catch (error) {
      console.error("Load integrations error:", error);
      toast({
        title: "Error",
        description: "Failed to load platform integrations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSyncLogs = async (integrationId: string) => {
    try {
      const logs = await platformSyncService.getSyncLogs(integrationId, 20);
      setSyncLogs(logs);
    } catch (error) {
      console.error("Load sync logs error:", error);
    }
  };

  const handleAddIntegration = async () => {
    try {
      setIsLoading(true);
      await platformSyncService.createIntegration({
        vendorId: user!.id,
        ...newIntegration,
      });

      toast({
        title: "Success",
        description: "Platform integration added successfully",
      });

      setShowAddDialog(false);
      setNewIntegration({
        platformName: "",
        storeId: "",
        apiKey: "",
        apiSecret: "",
        syncFrequency: "hourly",
      });

      loadIntegrations();
    } catch (error) {
      console.error("Add integration error:", error);
      toast({
        title: "Error",
        description: "Failed to add platform integration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async (integrationId: string) => {
    try {
      setIsSyncing(integrationId);
      const result = await platformSyncService.triggerManualSync(integrationId);

      if (result.success) {
        toast({
          title: "Sync Complete",
          description: `Synced ${result.productsUpdated} products successfully`,
        });
      } else {
        toast({
          title: "Sync Completed with Errors",
          description: `${result.productsUpdated} products synced, ${result.productsFailed} failed`,
          variant: "destructive",
        });
      }

      loadIntegrations();
      if (selectedIntegration) {
        loadSyncLogs(selectedIntegration);
      }
    } catch (error) {
      console.error("Manual sync error:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync products",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(null);
    }
  };

  const handleToggleAutoSync = async (integrationId: string, enabled: boolean) => {
    try {
      await platformSyncService.toggleAutoSync(integrationId, enabled);
      toast({
        title: "Success",
        description: `Auto-sync ${enabled ? "enabled" : "disabled"}`,
      });
      loadIntegrations();
    } catch (error) {
      console.error("Toggle auto-sync error:", error);
      toast({
        title: "Error",
        description: "Failed to update auto-sync setting",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      amazon: "📦",
      ebay: "🛒",
      shopsy: "🛍️",
      meesho: "👕",
      flipkart: "🏪",
    };
    return icons[platform] || "🏬";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      success: "bg-green-500",
      failed: "bg-red-500",
      pending: "bg-yellow-500",
      syncing: "bg-blue-500",
    };
    return colors[status] || "bg-slate-500";
  };

  if (!user) return null;

  return (
    <>
      <SEO title="Platform Sync - Vendor Dashboard" />

      <DashboardLayout role="vendor">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Platform Sync
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Auto-sync products from Amazon, eBay, Shopsy, Meesho, and more
              </p>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Platform
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Platform Integration</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Platform</Label>
                    <Select
                      value={newIntegration.platformName}
                      onValueChange={(value) =>
                        setNewIntegration({ ...newIntegration, platformName: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="ebay">eBay</SelectItem>
                        <SelectItem value="shopsy">Shopsy</SelectItem>
                        <SelectItem value="meesho">Meesho</SelectItem>
                        <SelectItem value="flipkart">Flipkart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Store ID</Label>
                    <Input
                      value={newIntegration.storeId}
                      onChange={(e) =>
                        setNewIntegration({ ...newIntegration, storeId: e.target.value })
                      }
                      placeholder="Your store ID"
                    />
                  </div>

                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={newIntegration.apiKey}
                      onChange={(e) =>
                        setNewIntegration({ ...newIntegration, apiKey: e.target.value })
                      }
                      placeholder="API Key"
                    />
                  </div>

                  <div>
                    <Label>API Secret</Label>
                    <Input
                      type="password"
                      value={newIntegration.apiSecret}
                      onChange={(e) =>
                        setNewIntegration({ ...newIntegration, apiSecret: e.target.value })
                      }
                      placeholder="API Secret"
                    />
                  </div>

                  <div>
                    <Label>Sync Frequency</Label>
                    <Select
                      value={newIntegration.syncFrequency}
                      onValueChange={(value) =>
                        setNewIntegration({ ...newIntegration, syncFrequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time (5 min)</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleAddIntegration}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Adding..." : "Add Integration"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card
                key={integration.id}
                className={`cursor-pointer transition-all ${
                  selectedIntegration === integration.id
                    ? "ring-2 ring-cyan-500"
                    : ""
                }`}
                onClick={() => setSelectedIntegration(integration.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {getPlatformIcon(integration.platform_name)}
                      </span>
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {integration.platform_name}
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {integration.platform_store_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Status
                    </span>
                    <Badge
                      className={`${getStatusColor(integration.sync_status)} text-white`}
                    >
                      {integration.sync_status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Auto-Sync
                    </span>
                    <Badge variant={integration.sync_enabled ? "default" : "secondary"}>
                      {integration.sync_enabled ? "ON" : "OFF"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Frequency
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {integration.sync_frequency}
                    </span>
                  </div>

                  {integration.last_sync_at && (
                    <div className="text-xs text-slate-500">
                      Last sync: {new Date(integration.last_sync_at).toLocaleString()}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleManualSync(integration.id);
                      }}
                      disabled={isSyncing === integration.id}
                      className="flex-1"
                    >
                      {isSyncing === integration.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAutoSync(
                          integration.id,
                          !integration.sync_enabled
                        );
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sync Logs */}
          {selectedIntegration && (
            <Card>
              <CardHeader>
                <CardTitle>Sync History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {syncLogs.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                      No sync history yet
                    </div>
                  ) : (
                    syncLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {log.status === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : log.status === "failed" ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          )}

                          <div>
                            <p className="font-medium">
                              {log.products_fetched} products fetched
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {log.products_updated} updated, {log.products_failed} failed
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge
                            className={`${getStatusColor(log.status)} text-white`}
                          >
                            {log.status}
                          </Badge>
                          {log.duration_seconds && (
                            <p className="text-xs text-slate-500 mt-1">
                              {log.duration_seconds}s
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}