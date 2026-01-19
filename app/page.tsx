"use client";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, CheckCircle, Bell, TrendingUp, Shield } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import EnhancedHeroSection from "@/components/enhanced-hero-section";

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();
  const { language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"];
  const partners = [
    { name: "Eldohub", logo: "/eh.png" },
    { name: "Adak", logo: "/adak.jpg" },
    { name: "Techrun", logo: "/tr.png" },
    { name: "Athletics kenya", logo: "/ak.png" },
    { name: "ict", logo: "/ict.png" },
    { name: "Nike", logo: "/nike.png" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Navbar />

      {/* Show login/signup buttons only when not authenticated */}
      {!isAuthenticated && (
        <nav className="sticky top-12 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-end items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              {t("signIn")}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("startFreeTrial")}
            </Link>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <main className="flex-1 mx-auto px-2 sm:px-6 lg:px-8 py-4 flex flex-col justify-center w-full">
        <EnhancedHeroSection />

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: t("whereaboutsTracking"),
              description: t("automatedLocation"),
              icon: <Users className="w-8 h-8 text-primary" />,
            },
            {
              title: t("roleBasedAccess"),
              description: t("rolesDescription"),
              icon: <Shield className="w-8 h-8 text-primary" />,
            },
            {
              title: t("alertManagement"),
              description: t("realtimeNotifications"),
              icon: <Bell className="w-8 h-8 text-primary" />,
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">
            {t("whyChoose")}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: t("realtimeVerification"),
                description: t("instantVerify"),
                icon: <CheckCircle className="w-6 h-6 text-green-500" />,
              },
              {
                title: t("complianceMadeEasy"),
                description: t("stayCompliant"),
                icon: <Shield className="w-6 h-6 text-blue-500" />,
              },
              {
                title: t("teamCoordination"),
                description: t("seamlesslyCoordinate"),
                icon: <Users className="w-6 h-6 text-purple-500" />,
              },
              {
                title: t("performanceAnalytics"),
                description: t("trackTrends"),
                icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted By Leading Partners
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our ecosystem is supported by top brands and sports technology
              partners.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 place-items-center px-6">
            {partners.map((p) => (
              <div key={p.name} className="">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </section> */}

        {!isAuthenticated && (
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-foreground mb-12 text-center">
              {t("simplePricing")}
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "Ksh.990",
                  period: "/month",
                  features: [
                    "Up to 50 athletes",
                    "Basic alerts",
                    "Role-based access",
                    "Email support",
                  ],
                  highlighted: false,
                },
                {
                  name: "Professional",
                  price: "Ksh.2,990",
                  period: "/month",
                  features: [
                    "Up to 500 athletes",
                    "Advanced alerts",
                    "Full verification system",
                    "Priority support",
                    "Analytics dashboard",
                  ],
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "pricing",
                  features: [
                    "Unlimited athletes",
                    "Custom integrations",
                    "Dedicated support",
                    "SLA guarantee",
                    "On-premise option",
                  ],
                  highlighted: false,
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-8 flex flex-col ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground border-2 border-primary transform scale-105"
                      : "bg-card border border-border"
                  }`}
                >
                  <h4 className={`text-2xl font-bold mb-2`}>{plan.name}</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span
                      className={`text-sm ${
                        plan.highlighted
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    {" "}
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-opacity hover:opacity-90 ${
                        plan.highlighted
                          ? "bg-primary-foreground text-primary"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {t("startFreeTrial")}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 bg-primary text-primary-foreground rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">{t("readyToTransform")}</h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {t("joinHundreds")}
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t("startFreeTrial")}
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-primary-foreground text-primary-foreground rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                {t("signIn")}
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
