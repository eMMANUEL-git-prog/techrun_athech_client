"use client";

import { formatDate, formatTime } from "@/utils/helpers";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface Alert {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  severity?: "low" | "medium" | "high";
  createdAt?: string | number;
  created_at?: string | number;
  read?: boolean;
}

interface AlertListProps {
  alerts: Alert[];
  onMarkAsRead?: (alertId: string) => void;
}

export function AlertList({ alerts, onMarkAsRead }: AlertListProps) {
  const getAlertStyles = (type: string, severity?: string) => {
    if (severity === "high") {
      return {
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-900 dark:text-red-100",
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      };
    }
    if (severity === "medium") {
      return {
        bg: "bg-yellow-50 dark:bg-yellow-950/30",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-900 dark:text-yellow-100",
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      };
    }

    const styles: Record<string, any> = {
      info: {
        bg: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-900 dark:text-blue-100",
        icon: <Info className="w-5 h-5 text-blue-500" />,
      },
      warning: {
        bg: "bg-yellow-50 dark:bg-yellow-950/30",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-900 dark:text-yellow-100",
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      },
      error: {
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-900 dark:text-red-100",
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      },
      success: {
        bg: "bg-green-50 dark:bg-green-950/30",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-900 dark:text-green-100",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      },
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No alerts</p>
        </div>
      ) : (
        alerts.map((alert) => {
          const styles = getAlertStyles(alert.type, alert.severity);

          // SAFE TIMESTAMP: support both createdAt and created_at
          const created = alert.createdAt || alert.created_at;

          return (
            <div
              key={alert.id}
              onClick={() => onMarkAsRead?.(alert.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                styles.bg
              } ${styles.border} ${alert.read ? "opacity-60" : "opacity-100"}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold mb-1 ${styles.text}`}>
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-2 text-xs opacity-75">
                    {created ? (
                      <>
                        <span>{formatTime(created)}</span>
                        <span>•</span>
                        <span>{formatDate(created)}</span>
                      </>
                    ) : (
                      <span>—</span>
                    )}

                    {!alert.read && (
                      <>
                        <span>•</span>
                        <span className="font-semibold">NEW</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
