"use client";

import type React from "react";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { mockStorage } from "@/lib/mock-storage";
import { showToast } from "@/lib/toast";
import {
  MapPin,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit2,
  Trash2,
} from "lucide-react";

interface WhereaboutSubmission {
  id: string;
  date: string;
  timeSlot: string;
  location: string;
  address: string;
  city: string;
  country: string;
  activityType: string;
  notes: string;
  status: "pending" | "verified" | "flagged";
  submittedAt: number;
}

export default function WhereaboutsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<WhereaboutSubmission[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "06:00-07:00",
    location: "",
    address: "",
    city: "",
    country: "",
    activityType: "training",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<WhereaboutSubmission | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "athlete")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, user, router]);

  useEffect(() => {
    // Load whereabouts from localStorage
    const loadWhereabouts = () => {
      const stored = localStorage.getItem("athlete_whereabouts");
      if (stored) {
        setSubmissions(JSON.parse(stored));
      } else {
        // Initialize with mock data
        const mockData: WhereaboutSubmission[] = [
          {
            id: "wh1",
            date: "2024-01-15",
            timeSlot: "06:00-07:00",
            location: "National Training Center",
            address: "123 Olympic Blvd",
            city: "Los Angeles",
            country: "USA",
            activityType: "training",
            notes: "Morning training session",
            status: "verified",
            submittedAt: Date.now() - 86400000,
          },
        ];
        setSubmissions(mockData);
        localStorage.setItem("athlete_whereabouts", JSON.stringify(mockData));
      }
      setPageLoading(false);
    };

    if (isAuthenticated) {
      loadWhereabouts();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (selectedSubmission) {
        // Update existing
        const updated = submissions.map((s) =>
          s.id === selectedSubmission.id ? { ...s, ...formData } : s
        );
        setSubmissions(updated);
        localStorage.setItem("athlete_whereabouts", JSON.stringify(updated));
        showToast("Whereabouts updated successfully", "success");
        setShowEditModal(false);
        setSelectedSubmission(null);
      } else {
        // Create new
        const newSubmission: WhereaboutSubmission = {
          id: `wh${Date.now()}`,
          ...formData,
          status: "pending",
          submittedAt: Date.now(),
        };

        const updated = [newSubmission, ...submissions];
        setSubmissions(updated);
        localStorage.setItem("athlete_whereabouts", JSON.stringify(updated));

        mockStorage.addWhereabout({
          userId: user?.id || "",
          latitude: 0,
          longitude: 0,
          address: formData.address,
          submittedAt: Date.now(),
          verified: false,
        });

        showToast("Whereabouts submitted successfully", "success");
      }

      setFormData({
        date: "",
        timeSlot: "06:00-07:00",
        location: "",
        address: "",
        city: "",
        country: "",
        activityType: "training",
        notes: "",
      });
    } catch (error) {
      showToast("Failed to submit whereabouts", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (
      confirm("Are you sure you want to delete this whereabouts submission?")
    ) {
      const updated = submissions.filter((s) => s.id !== id);
      setSubmissions(updated);
      localStorage.setItem("athlete_whereabouts", JSON.stringify(updated));
      showToast("Whereabouts deleted successfully", "success");
    }
  };

  const handleEdit = (submission: WhereaboutSubmission) => {
    setFormData({
      date: submission.date,
      timeSlot: submission.timeSlot,
      location: submission.location,
      address: submission.address,
      city: submission.city,
      country: submission.country,
      activityType: submission.activityType,
      notes: submission.notes,
    });
    setSelectedSubmission(submission);
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200";
      case "flagged":
        return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200";
      default:
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200";
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium">
              Loading whereabouts...
            </p>
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
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-xl">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Whereabouts Submissions
              </h1>
              <p className="text-muted-foreground text-sm">
                ADAMS-compliant location tracking for out-of-competition testing
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <p className="text-xs text-muted-foreground font-medium">
                  Verified
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {submissions.filter((s) => s.status === "verified").length}
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-500" />
                <p className="text-xs text-muted-foreground font-medium">
                  Pending
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {submissions.filter((s) => s.status === "pending").length}
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-xs text-muted-foreground font-medium">
                  Flagged
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {submissions.filter((s) => s.status === "flagged").length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              {showEditModal ? "Edit Whereabouts" : "Submit Whereabouts"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time Slot *
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) =>
                      setFormData({ ...formData, timeSlot: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="00:00-01:00">00:00 - 01:00</option>
                    <option value="06:00-07:00">06:00 - 07:00</option>
                    <option value="07:00-08:00">07:00 - 08:00</option>
                    <option value="12:00-13:00">12:00 - 13:00</option>
                    <option value="18:00-19:00">18:00 - 19:00</option>
                    <option value="20:00-21:00">20:00 - 21:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="National Training Center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="123 Olympic Boulevard"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Los Angeles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="USA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Activity Type *
                </label>
                <select
                  value={formData.activityType}
                  onChange={(e) =>
                    setFormData({ ...formData, activityType: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="training">Training</option>
                  <option value="competition">Competition</option>
                  <option value="home">Home/Residence</option>
                  <option value="travel">Travel</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                {showEditModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSubmission(null);
                      setFormData({
                        date: "",
                        timeSlot: "06:00-07:00",
                        location: "",
                        address: "",
                        city: "",
                        country: "",
                        activityType: "training",
                        notes: "",
                      });
                    }}
                    className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {showEditModal ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {showEditModal
                        ? "Update Whereabouts"
                        : "Submit Whereabouts"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Schedule
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {submissions
                .filter((s) => new Date(s.date) >= new Date())
                .slice(0, 10)
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="group p-4 border border-border rounded-xl hover:border-primary hover:shadow-md transition-all bg-background/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {submission.location}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(submission.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          • {submission.timeSlot}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {submission.address}, {submission.city},{" "}
                        {submission.country}
                      </span>
                    </p>
                  </div>
                ))}
              {submissions.filter((s) => new Date(s.date) >= new Date())
                .length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No upcoming whereabouts scheduled
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Submission History
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Date & Time
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Location
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Address
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Activity
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 text-sm text-foreground">
                      <div className="font-medium">
                        {new Date(submission.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {submission.timeSlot}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground font-medium">
                      {submission.location}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                      {submission.address}, {submission.city}
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      <span className="capitalize inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-xs font-medium">
                        {submission.activityType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status === "verified" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {submission.status === "pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {submission.status === "flagged" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {submission.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(submission)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors group"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors group"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
