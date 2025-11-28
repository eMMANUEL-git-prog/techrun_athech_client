"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Search,
} from "lucide-react";

export default function DopingCalculatorPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const bannedSubstances = [
    {
      name: "Anabolic Steroids",
      category: "Steroids",
      risk: "High",
      examples: ["Testosterone", "Nandrolone", "Stanozolol", "Boldenone"],
      effects: "Increased muscle mass, strength, and endurance",
      sideEffects: "Liver damage, cardiovascular issues, hormonal imbalance",
      detectionTime: "3-18 months",
    },
    {
      name: "Erythropoietin (EPO)",
      category: "Peptide Hormones",
      risk: "High",
      examples: ["Epoetin alfa", "Darbepoetin", "CERA"],
      effects: "Increases red blood cell production and oxygen delivery",
      sideEffects: "Blood clots, stroke, heart attack",
      detectionTime: "2-6 weeks",
    },
    {
      name: "Stimulants",
      category: "Stimulants",
      risk: "Medium",
      examples: ["Amphetamine", "Cocaine", "Ephedrine", "Methylphenidate"],
      effects: "Increased alertness, reduced fatigue",
      sideEffects: "Anxiety, heart problems, addiction",
      detectionTime: "1-7 days",
    },
    {
      name: "Beta-2 Agonists",
      category: "Beta Agonists",
      risk: "Medium",
      examples: ["Salbutamol", "Formoterol", "Clenbuterol"],
      effects: "Bronchodilation, increased muscle growth",
      sideEffects: "Tremors, tachycardia, muscle cramps",
      detectionTime: "24-48 hours",
    },
    {
      name: "Diuretics",
      category: "Masking Agents",
      risk: "High",
      examples: ["Furosemide", "Hydrochlorothiazide", "Spironolactone"],
      effects: "Rapid weight loss, masking other substances",
      sideEffects: "Dehydration, electrolyte imbalance, kidney damage",
      detectionTime: "24-72 hours",
    },
    {
      name: "Human Growth Hormone (HGH)",
      category: "Peptide Hormones",
      risk: "High",
      examples: ["Somatropin", "Somatorelin"],
      effects: "Muscle growth, fat loss, recovery enhancement",
      sideEffects: "Joint pain, diabetes, organ enlargement",
      detectionTime: "24-36 hours",
    },
  ];

  const safeAlternatives = [
    {
      goal: "Muscle Growth",
      natural: [
        "Creatine Monohydrate",
        "Whey Protein",
        "Beta-Alanine",
        "L-Carnitine",
      ],
      tips: "Focus on progressive overload training and adequate protein intake (1.6-2.2g per kg body weight)",
    },
    {
      goal: "Endurance Enhancement",
      natural: [
        "Beetroot Juice",
        "Caffeine",
        "Sodium Bicarbonate",
        "Carbohydrate Loading",
      ],
      tips: "Implement periodized training with proper recovery. Stay hydrated and maintain electrolyte balance.",
    },
    {
      goal: "Recovery",
      natural: [
        "Omega-3 Fatty Acids",
        "Tart Cherry Juice",
        "Magnesium",
        "Vitamin D",
      ],
      tips: "Prioritize 7-9 hours of sleep, active recovery, and proper nutrition timing post-workout.",
    },
    {
      goal: "Fat Loss",
      natural: [
        "Green Tea Extract",
        "Conjugated Linoleic Acid",
        "Protein Supplementation",
      ],
      tips: "Create a moderate caloric deficit (300-500 kcal), maintain resistance training, track macros.",
    },
  ];

  const antiDopingGuidelines = [
    {
      title: "Understand Your Responsibilities",
      description:
        "As an athlete, you are responsible for any substance found in your system. Always check medications and supplements before consumption.",
      icon: <AlertCircle className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Use the Global DRO",
      description:
        "Check the Global Drug Reference Online (GlobalDRO.com) before taking any medication or supplement to verify its status.",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Therapeutic Use Exemptions (TUE)",
      description:
        "If you have a legitimate medical condition requiring prohibited substances, apply for a TUE through your Anti-Doping Organization.",
      icon: <AlertCircle className="w-6 h-6 text-orange-500" />,
    },
    {
      title: "Report Whereabouts Accurately",
      description:
        "Maintain accurate whereabouts information to facilitate out-of-competition testing. Three missed tests = anti-doping rule violation.",
      icon: <CheckCircle className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Avoid Contaminated Supplements",
      description:
        "Many supplements contain unlisted banned substances. Only use certified products from reputable brands (NSF Certified for Sport, Informed Sport).",
      icon: <XCircle className="w-6 h-6 text-red-500" />,
    },
    {
      title: "Know Your Rights",
      description:
        "You have the right to a chaperone during testing, to request identification from testers, and to report any irregularities.",
      icon: <CheckCircle className="w-6 h-6 text-purple-500" />,
    },
  ];

  const filteredSubstances = bannedSubstances.filter((substance) => {
    const matchesSearch =
      substance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      substance.examples.some((ex) =>
        ex.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || substance.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(bannedSubstances.map((s) => s.category))),
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
            Doping & Anti-Doping Guidelines
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive information on banned substances, anti-doping
            regulations, and safe alternatives for athletes.
          </p>
        </div>

        {/* Anti-Doping Guidelines */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Essential Anti-Doping Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {antiDopingGuidelines.map((guideline, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
              >
                <div className="mb-4">{guideline.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {guideline.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {guideline.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Banned Substances Database */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Prohibited Substances Database
          </h2>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search substances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredSubstances.map((substance, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {substance.name}
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100">
                        {substance.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          substance.risk === "High"
                            ? "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
                            : "bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100"
                        }`}
                      >
                        {substance.risk} Risk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Examples:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {substance.examples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Detection Window:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {substance.detectionTime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Effects:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {substance.effects}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Side Effects:
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {substance.sideEffects}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safe Alternatives */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Safe & Legal Alternatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeAlternatives.map((alt, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {alt.goal}
                </h3>
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Recommended Supplements:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {alt.natural.map((supplement, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                      >
                        {supplement}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Pro Tip:</strong> {alt.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testing Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            What to Expect During Drug Testing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                In-Competition Testing:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Conducted during or immediately after competition</li>
                <li>• Random selection of athletes</li>
                <li>
                  • Must report to Doping Control Station within required
                  timeframe
                </li>
                <li>• Provide urine sample under direct observation</li>
                <li>• Results typically within 1-2 weeks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Out-of-Competition Testing:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Can occur anytime, anywhere without advance notice</li>
                <li>
                  • Athletes in Registered Testing Pool must provide whereabouts
                </li>
                <li>• Blood and/or urine samples may be collected</li>
                <li>• Testing for substances like EPO and Growth Hormone</li>
                <li>
                  • Typically conducted at home, training facility, or other
                  locations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
