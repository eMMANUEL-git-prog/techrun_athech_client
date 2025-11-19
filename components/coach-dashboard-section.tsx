"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { mockStorage } from "@/lib/mock-storage";
import { Users, TrendingUp, Calendar } from "lucide-react";

export function CoachDashboardSection() {
  const { language } = useLanguage();
  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const storedAthletes = mockStorage.getAthletes();
    const storedSessions = mockStorage.getTrainingSessions();
    setAthletes(storedAthletes);
    setSessions(storedSessions);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Team Athletes
            </h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {athletes.length}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Active athletes</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Performance
            </h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">+15%</p>
          <p className="text-sm text-muted-foreground mt-2">
            Week over week improvement
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Sessions</h3>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {sessions.length}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Scheduled trainings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Team Performance Metrics
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-foreground">Strength</span>
                <span className="text-sm font-medium text-foreground">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-foreground">Endurance</span>
                <span className="text-sm font-medium text-foreground">72%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "72%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-foreground">Speed</span>
                <span className="text-sm font-medium text-foreground">90%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Compliance Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-foreground">Medical Clearance</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100 text-xs rounded-full">
                100%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-foreground">Whereabouts Updated</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100 text-xs rounded-full">
                100%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-foreground">Anti-Doping Tests</span>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-100 text-xs rounded-full">
                95%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
