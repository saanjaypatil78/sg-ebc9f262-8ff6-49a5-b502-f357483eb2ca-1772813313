import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, AlertCircle, CheckCircle, TrendingDown, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "order" | "alert" | "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "SLA Breach Alert",
    message: "Vendor XYZ has fallen below 90% on-time delivery",
    time: "5 min ago",
    read: false
  },
  {
    id: "2",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-1248 has been assigned to you",
    time: "15 min ago",
    read: false
  },
  {
    id: "3",
    type: "success",
    title: "Settlement Processed",
    message: "February settlement of $45,670 completed",
    time: "2 hours ago",
    read: true
  },
  {
    id: "4",
    type: "warning",
    title: "Return Rate Threshold",
    message: "Return rate approaching 10% limit for Electronics category",
    time: "3 hours ago",
    read: true
  },
  {
    id: "5",
    type: "info",
    title: "New Vendor Approved",
    message: "TechHub Solutions has completed onboarding",
    time: "5 hours ago",
    read: true
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return Package;
      case "alert": return AlertCircle;
      case "success": return CheckCircle;
      case "warning": return TrendingDown;
      case "info": return Users;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "order": return "text-blue-600";
      case "alert": return "text-red-600";
      case "success": return "text-green-600";
      case "warning": return "text-orange-600";
      case "info": return "text-purple-600";
      default: return "text-slate-600";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <div key={notification.id}>
                <DropdownMenuItem
                  className={`flex items-start gap-3 p-3 cursor-pointer ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(notification.type)}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            );
          })}
        </ScrollArea>
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" className="w-full" size="sm">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}