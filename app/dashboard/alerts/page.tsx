"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { mockStorage } from "@/lib/mock-storage";
import { showToast } from "@/lib/toast";
import {
  Bell,
  Filter,
  Search,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

export default function AlertsPage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const storedAlerts = mockStorage.getAllAlerts();
        setAlerts(storedAlerts);
      } catch (error) {
        console.error("Error loading alerts:", error);
        showToast("Failed to load alerts", "error");
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && !loading) {
      loadAlerts();
    }
  }, [isAuthenticated, loading]);

  const handleDismiss = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
    showToast("Alert dismissed", "success");
  };

  const filteredAlerts = alerts
    .filter(
      (alert) => filterSeverity === "all" || alert.severity === filterSeverity
    )
    .filter(
      (alert) =>
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="w-5 h-5" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400";
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium">Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-xl">
              <Bell className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Alerts & Notifications
              </h1>
              <p className="text-muted-foreground text-sm">
                Stay updated with important information
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-card/80 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-3 border border-border rounded-xl bg-card/80 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No alerts found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || filterSeverity !== "all"
                  ? "Try adjusting your filters"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`group relative bg-card/80 backdrop-blur-sm border-2 rounded-xl p-6 shadow-md hover:shadow-lg transition-all ${getSeverityColor(
                  alert.severity
                )}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-current/10">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground capitalize mb-1">
                          {alert.type}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="p-2 hover:bg-muted/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <span className="capitalize px-2 py-1 bg-muted/50 rounded font-medium">
                          {alert.severity}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
