import { useState, useEffect } from "react";
import { Smartphone, Monitor, X, Plus, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { deviceFingerprintService } from "@/lib/security/device-fingerprint-service";
import { authService } from "@/services/authService";

export default function TrustedDevicesPage() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceName, setDeviceName] = useState("");
  const [addingDevice, setAddingDevice] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const user = authService.getSession();
    if (!user) return;

    try {
      const trustedDevices = await deviceFingerprintService.getTrustedDevices(user.id);
      setDevices(trustedDevices);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trusted devices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async () => {
    if (!deviceName.trim()) {
      toast({
        title: "Device Name Required",
        description: "Please enter a name for this device",
        variant: "destructive",
      });
      return;
    }

    setAddingDevice(true);
    const user = authService.getSession();

    try {
      await deviceFingerprintService.registerTrustedDevice(user!.id, deviceName);
      toast({
        title: "Device Added",
        description: "This device is now trusted",
      });
      setShowAddDialog(false);
      setDeviceName("");
      loadDevices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device",
        variant: "destructive",
      });
    } finally {
      setAddingDevice(false);
    }
  };

  const revokeDevice = async (deviceId: string) => {
    try {
      await deviceFingerprintService.revokeDevice(deviceId);
      toast({
        title: "Device Revoked",
        description: "This device is no longer trusted",
      });
      loadDevices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke device",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Trusted Devices</h1>
            <p className="text-slate-400">Manage devices authorized for high-value transactions</p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Add This Device
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Add Trusted Device</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Register this device for high-value transactions
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceName" className="text-slate-300">Device Name</Label>
                  <Input
                    id="deviceName"
                    placeholder="My Laptop / Work Phone"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <Button
                  onClick={addDevice}
                  disabled={addingDevice}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                >
                  {addingDevice ? "Adding..." : "Add Device"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <CardTitle className="text-amber-400">High-Value Account Protection</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              For accounts with investments ≥ ₹5 Crore, device binding is mandatory for transactions.
              Only trusted devices can execute high-value operations.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {loading ? (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6 text-center text-slate-400">
                Loading devices...
              </CardContent>
            </Card>
          ) : devices.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6 text-center text-slate-400">
                No trusted devices registered. Add your first device above.
              </CardContent>
            </Card>
          ) : (
            devices.map((device) => (
              <Card key={device.id} className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      {device.device_info?.platform?.includes("Mobile") ? (
                        <Smartphone className="w-6 h-6 text-white" />
                      ) : (
                        <Monitor className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{device.device_name}</h3>
                        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                          Trusted
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-slate-400">
                        <p>
                          {device.device_info?.browser} on {device.device_info?.os}
                        </p>
                        <p>Last Used: {new Date(device.last_used).toLocaleString()}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeDevice(device.id)}
                      className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Revoke
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