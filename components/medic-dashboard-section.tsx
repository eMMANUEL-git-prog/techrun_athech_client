"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { mockStorage } from "@/lib/mock-storage";
import { AlertCircle, Heart, FileText } from "lucide-react";

export function MedicDashboardSection() {
  const { language } = useLanguage();
  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);

  useEffect(() => {
    const records = mockStorage.getMedicalRecords();
    if (records.length === 0) {
      // Create mock medical records
      mockStorage.addMedicalRecord({
        athleteId: "2",
        type: "injury",
        title: "Left Ankle Sprain",
        description: "Grade 2 ankle sprain, recovery in progress",
        status: "pending",
        date: Date.now() - 86400000 * 5,
      });
      mockStorage.addMedicalRecord({
        athleteId: "3",
        type: "clearance",
        title: "Medical Clearance Approved",
        description: "Athlete cleared for full competition",
        status: "approved",
        date: Date.now(),
      });
      setMedicalRecords(mockStorage.getMedicalRecords());
    } else {
      setMedicalRecords(records);
    }
  }, []);

  const pendingRecords = medicalRecords.filter((r) => r.status === "pending");
  const approvedRecords = medicalRecords.filter((r) => r.status === "approved");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Total Records
            </h3>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {medicalRecords.length}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Medical records</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Pending</h3>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {pendingRecords.length}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Awaiting approval
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Approved</h3>
            <Heart className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {approvedRecords.length}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Clearances granted
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Pending Approvals
          </h3>
          <div className="space-y-3">
            {pendingRecords.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No pending records
              </p>
            ) : (
              pendingRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800"
                >
                  <p className="font-semibold text-orange-900 dark:text-orange-100">
                    {record.title}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    {record.description}
                  </p>
                  <button className="mt-2 text-sm px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
                    Review
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Clearances
          </h3>
          <div className="space-y-3">
            {approvedRecords.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No approved records
              </p>
            ) : (
              approvedRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    {record.title}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {record.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
