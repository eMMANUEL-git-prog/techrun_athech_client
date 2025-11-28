"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Pill,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

export default function MedicationCalculatorPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "Twice daily",
      startDate: "2024-01-15",
      status: "WADA Approved",
    },
    {
      id: 2,
      name: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Once daily",
      startDate: "2024-01-10",
      status: "WADA Approved",
    },
  ]);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
  });
  const [checkingInteractions, setCheckingInteractions] = useState(false);
  const [interactions, setInteractions] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleAddMedication = () => {
    if (
      !newMedication.name ||
      !newMedication.dosage ||
      !newMedication.frequency
    ) {
      alert("Please fill all fields");
      return;
    }

    const med = {
      id: Date.now(),
      ...newMedication,
      status: checkWADAStatus(newMedication.name),
    };

    setMedications([...medications, med]);
    setNewMedication({ name: "", dosage: "", frequency: "", startDate: "" });
  };

  const checkWADAStatus = (medName: string): string => {
    const prohibited = [
      "pseudoephedrine",
      "testosterone",
      "nandrolone",
      "stanozolol",
      "clenbuterol",
    ];
    const restricted = ["salbutamol", "formoterol"];

    const lowerName = medName.toLowerCase();

    if (prohibited.some((p) => lowerName.includes(p))) {
      return "PROHIBITED";
    } else if (restricted.some((r) => lowerName.includes(r))) {
      return "RESTRICTED - TUE Required";
    }
    return "WADA Approved";
  };

  const handleRemoveMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const checkInteractions = () => {
    setCheckingInteractions(true);

    // Simulate AI checking
    setTimeout(() => {
      const mockInteractions = [
        {
          medications: ["Ibuprofen", "Aspirin"],
          severity: "Moderate",
          description:
            "Both are NSAIDs. Taking together may increase risk of gastrointestinal bleeding.",
          recommendation:
            "Consult physician. Consider spacing doses or using alternative pain relief.",
        },
        {
          medications: ["Vitamin D3", "Calcium"],
          severity: "Low",
          description:
            "Vitamin D enhances calcium absorption. Generally beneficial but monitor calcium levels.",
          recommendation: "Continue as prescribed. Ensure adequate hydration.",
        },
      ];

      setInteractions(mockInteractions);
      setCheckingInteractions(false);
    }, 2000);
  };

  const commonAthleteSupplements = [
    {
      name: "Creatine Monohydrate",
      purpose: "Muscle strength and power",
      dosage: "3-5g daily",
      timing: "Post-workout or morning",
      status: "WADA Approved",
      notes: "Most researched supplement. Stay hydrated.",
    },
    {
      name: "Whey Protein",
      purpose: "Muscle recovery and growth",
      dosage: "20-40g per serving",
      timing: "Post-workout, between meals",
      status: "WADA Approved",
      notes: "Choose NSF Certified for Sport brands.",
    },
    {
      name: "Omega-3 Fish Oil",
      purpose: "Anti-inflammation, joint health",
      dosage: "1-3g EPA+DHA daily",
      timing: "With meals",
      status: "WADA Approved",
      notes: "Reduces muscle soreness and inflammation.",
    },
    {
      name: "Beta-Alanine",
      purpose: "Endurance, delays fatigue",
      dosage: "2-5g daily",
      timing: "Pre-workout or split doses",
      status: "WADA Approved",
      notes: "May cause tingling sensation (harmless).",
    },
    {
      name: "Caffeine",
      purpose: "Energy, focus, performance",
      dosage: "3-6mg per kg body weight",
      timing: "30-60 min pre-exercise",
      status: "WADA Approved (Below 15μg/mL in urine)",
      notes: "Monitor total daily intake. Tolerance builds.",
    },
    {
      name: "Vitamin D",
      purpose: "Bone health, immune function",
      dosage: "2000-5000 IU daily",
      timing: "With fatty meal",
      status: "WADA Approved",
      notes: "Test levels annually. Essential for athletes.",
    },
  ];

  if (loading) {
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
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Medication & Supplement Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your medications and supplements, check WADA compliance, and
            identify potential drug interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Add Medication Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Medication
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Ibuprofen"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        dosage: e.target.value,
                      })
                    }
                    placeholder="e.g., 400mg"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Frequency
                  </label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="As needed">As needed</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  onClick={handleAddMedication}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Add Medication
                </button>
              </div>
            </div>
          </div>

          {/* Current Medications */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Current Medications ({medications.length})
                </h2>
                <button
                  onClick={checkInteractions}
                  disabled={checkingInteractions || medications.length < 2}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {checkingInteractions ? "Checking..." : "Check Interactions"}
                </button>
              </div>

              <div className="space-y-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="bg-background border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {med.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              med.status === "WADA Approved"
                                ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                                : med.status.includes("RESTRICTED")
                                ? "bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100"
                                : "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
                            }`}
                          >
                            {med.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Dosage:</span>{" "}
                            {med.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span>{" "}
                            {med.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Started:</span>{" "}
                            {med.startDate}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMedication(med.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {medications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No medications added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Drug Interactions */}
            {interactions.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Potential Interactions ({interactions.length})
                </h2>

                <div className="space-y-4">
                  {interactions.map((interaction, idx) => (
                    <div
                      key={idx}
                      className="bg-background border-l-4 border-orange-500 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {interaction.medications.join(" + ")}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                interaction.severity === "High"
                                  ? "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
                                  : interaction.severity === "Moderate"
                                  ? "bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100"
                                  : "bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100"
                              }`}
                            >
                              {interaction.severity} Severity
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {interaction.description}
                          </p>
                          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-3">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                              <strong>Recommendation:</strong>{" "}
                              {interaction.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Common Athlete Supplements */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Common Athlete Supplements Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonAthleteSupplements.map((supplement, idx) => (
              <div
                key={idx}
                className="bg-background border border-border rounded-lg p-5"
              >
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {supplement.name}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    supplement.status.includes("Approved")
                      ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                      : "bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100"
                  }`}
                >
                  {supplement.status}
                </span>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-foreground">
                      Purpose:
                    </span>
                    <p className="text-muted-foreground">
                      {supplement.purpose}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Dosage:
                    </span>
                    <p className="text-muted-foreground">{supplement.dosage}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Timing:
                    </span>
                    <p className="text-muted-foreground">{supplement.timing}</p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      {supplement.notes}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
