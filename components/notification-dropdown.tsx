"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, X, Check, AlertCircle } from "lucide-react";
import { mockStorage, type StorageAlert } from "@/lib/mock-storage";
import { formatTime } from "@/utils/helpers";
import { useAuth } from "@/context/auth-provider";

export function NotificationDropdown() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<StorageAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    if (user?.id) {
      const userAlerts = mockStorage.getAlerts(user.id);
      setAlerts(userAlerts.sort((a, b) => b.createdAt - a.createdAt));
    }
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = (alertId: string) => {
    mockStorage.markAlertAsRead(alertId);
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  const handleMarkAllAsRead = () => {
    alerts.forEach((alert) => {
      if (!alert.read) {
        mockStorage.markAlertAsRead(alert.id);
      }
    });
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => ({ ...alert, read: true }))
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
      default:
        return "bg-muted border-border";
    }
  };

  const getTypeIcon = (type: string) => {
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="overflow-y-auto flex-1">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => !alert.read && handleMarkAsRead(alert.id)}
                    className={`p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                      !alert.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 p-2 rounded-lg ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p
                            className={`text-sm ${
                              !alert.read
                                ? "font-semibold text-foreground"
                                : "text-foreground/80"
                            }`}
                          >
                            {alert.message}
                          </p>
                          {!alert.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>
                        {alert.details && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {alert.details}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="capitalize">{alert.type}</span>
                          <span>•</span>
                          <span>{formatTime(alert.createdAt.toString())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {alerts.length > 0 && (
            <div className="p-3 border-t border-border bg-muted/30">
              <button className="w-full text-center text-sm text-primary hover:underline font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
