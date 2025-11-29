"use client";

import type React from "react";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { Footprints, Plus, AlertCircle, CheckCircle } from "lucide-react";

export default function EquipmentPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    equipment_type: "shoes",
    brand: "",
    model: "",
    purchase_date: "",
    first_use_date: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.equipment.getAll();
        setEquipment(response.data.equipment || []);
      } catch (error) {
        console.error("Error loading equipment:", error);
        showToast("Failed to load equipment", "error");
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && !loading) {
      loadData();
    }
  }, [isAuthenticated, loading]);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.equipment.create({
        ...formData,
        activity_types: ["running"],
        terrain_types: ["road"],
      });
      showToast("Equipment added successfully", "success");
      setShowAddModal(false);
      // Reload equipment
      const response = await api.equipment.getAll();
      setEquipment(response.data.equipment || []);
      setFormData({
        equipment_type: "shoes",
        brand: "",
        model: "",
        purchase_date: "",
        first_use_date: "",
      });
    } catch (error) {
      console.error("Error adding equipment:", error);
      showToast("Failed to add equipment", "error");
    }
  };

  const getWearLevelColor = (wear_level: string) => {
    switch (wear_level) {
      case "new":
        return "text-green-600 bg-green-100 dark:bg-green-950";
      case "good":
        return "text-blue-600 bg-blue-100 dark:bg-blue-950";
      case "fair":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950";
      case "worn":
        return "text-orange-600 bg-orange-100 dark:bg-orange-950";
      case "replace":
        return "text-red-600 bg-red-100 dark:bg-red-950";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Equipment Tracking
            </h1>
            <p className="text-muted-foreground">
              Monitor your shoes, insoles, and wearables
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </div>

        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item: any) => (
              <div
                key={item.id}
                className="bg-card border-2 border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <Footprints className="w-12 h-12 text-primary" />
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getWearLevelColor(
                      item.wear_level || "good"
                    )}`}
                  >
                    {item.wear_level || "Good"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1">
                  {item.brand} {item.model}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 capitalize">
                  {item.equipment_type}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Mileage:
                    </span>
                    <span className="font-medium text-foreground">
                      {item.total_mileage || 0} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Uses:</span>
                    <span className="font-medium text-foreground">
                      {item.total_uses || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cushioning:</span>
                    <span className="font-medium text-foreground">
                      {item.cushioning_score || "N/A"}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Use:</span>
                    <span className="font-medium text-foreground">
                      {item.first_use_date
                        ? new Date(item.first_use_date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {item.wear_level === "replace" && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Time to replace this equipment
                    </p>
                  </div>
                )}

                {item.status === "active" && (
                  <div className="mt-4 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Active</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Footprints className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Equipment Tracked Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your shoes and equipment to monitor wear and
              optimize performance.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Add Your First Equipment
            </button>
          </div>
        )}
      </main>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Add New Equipment
            </h2>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Equipment Type
                </label>
                <select
                  value={formData.equipment_type}
                  onChange={(e) =>
                    setFormData({ ...formData, equipment_type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="shoes">Shoes</option>
                  <option value="insoles">Insoles</option>
                  <option value="spikes">Spikes</option>
                  <option value="wearable">Wearable Device</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) =>
                    setFormData({ ...formData, purchase_date: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  First Use Date
                </label>
                <input
                  type="date"
                  value={formData.first_use_date}
                  onChange={(e) =>
                    setFormData({ ...formData, first_use_date: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
