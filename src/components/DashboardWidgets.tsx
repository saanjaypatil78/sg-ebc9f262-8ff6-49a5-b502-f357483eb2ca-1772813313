import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  RotateCcw,
  Users,
  FileText,
  Target,
  Settings,
  GripVertical
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WidgetConfig {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  role: string[];
}

const availableWidgets: WidgetConfig[] = [
  { id: "total-orders", name: "Total Orders", icon: Package, enabled: true, role: ["client", "vendor", "admin"] },
  { id: "revenue", name: "Revenue", icon: DollarSign, enabled: true, role: ["vendor", "admin"] },
  { id: "on-time", name: "On-Time Delivery", icon: Clock, enabled: true, role: ["vendor", "admin"] },
  { id: "return-rate", name: "Return Rate", icon: RotateCcw, enabled: true, role: ["vendor", "admin"] },
  { id: "pending-actions", name: "Pending Actions", icon: AlertCircle, enabled: true, role: ["all"] },
  { id: "performance", name: "Performance Score", icon: Target, enabled: true, role: ["vendor", "admin"] },
  { id: "active-vendors", name: "Active Vendors", icon: Users, enabled: true, role: ["admin", "bdm"] },
  { id: "monthly-growth", name: "Monthly Growth", icon: TrendingUp, enabled: true, role: ["admin", "bdm"] },
];

interface DashboardWidgetsProps {
  role: "client" | "vendor" | "admin" | "bdm";
  data?: any;
}

export function DashboardWidgets({ role, data = {} }: DashboardWidgetsProps) {
  const [widgets, setWidgets] = useState(availableWidgets);
  const [isDragging, setIsDragging] = useState(false);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const enabledWidgets = widgets.filter(w => 
    w.enabled && (w.role.includes(role) || w.role.includes("all"))
  );

  return (
    <div className="space-y-6">
      {/* Widget Customization Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Dashboard Overview
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Customize Widgets
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Your Dashboard</DialogTitle>
              <DialogDescription>
                Select which widgets to display on your dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {availableWidgets
                .filter(w => w.role.includes(role) || w.role.includes("all"))
                .map((widget) => (
                  <div key={widget.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={widget.id}
                      checked={widget.enabled}
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                    <Label htmlFor={widget.id} className="flex items-center gap-2 cursor-pointer">
                      <widget.icon className="w-4 h-4" />
                      {widget.name}
                    </Label>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enabledWidgets.map((widget) => (
          <Card 
            key={widget.id}
            className="hover:shadow-lg transition-shadow cursor-move"
            draggable
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-400" />
                  <widget.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="text-xs text-slate-500">Live</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {widget.name}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {getWidgetValue(widget.id, data)}
              </p>
              {getWidgetTrend(widget.id, data) && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    {getWidgetTrend(widget.id, data)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getWidgetValue(widgetId: string, data: any): string {
  const defaults: { [key: string]: string } = {
    "total-orders": "1,247",
    "revenue": "$156,780",
    "on-time": "94.8%",
    "return-rate": "6.2%",
    "pending-actions": "12",
    "performance": "92/100",
    "active-vendors": "147",
    "monthly-growth": "+18.5%"
  };
  
  return data[widgetId] || defaults[widgetId] || "N/A";
}

function getWidgetTrend(widgetId: string, data: any): string | null {
  const trends: { [key: string]: string } = {
    "total-orders": "+12.5%",
    "revenue": "+8.3%",
    "on-time": "+2.1%",
    "performance": "+5.2%",
    "monthly-growth": "+18.5%"
  };
  
  return data[`${widgetId}-trend`] || trends[widgetId] || null;
}