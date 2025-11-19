"use client";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    setMenuOpen(false);
    router.push("/");
  };

  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <Link href="/" className="">
            <img src="/logo.png" alt="" className="h-10" />
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                {t("dashboard")}
              </Link>
              {user?.role === "admin" && (
                <>
                  <Link
                    href="/dashboard/athletes"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {t("athletes")}
                  </Link>
                  <Link
                    href="/dashboard/verifications"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {t("verifications")}
                  </Link>
                </>
              )}
              {(user?.role === "athlete" || user?.role === "coach") && (
                <Link
                  href="/dashboard/whereabouts"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {t("whereabouts")}
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex flex-row items-center text-foreground text-sm hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                <Globe className="mr-2 h-6" />
                {language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {(["en", "es", "fr"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
                      language === lang
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    {lang === "en"
                      ? "English"
                      : lang === "es"
                      ? "Español"
                      : "Français"}
                  </button>
                ))}
              </div>
            </div>

            {/* User profile menu */}
            {isAuthenticated && (
              <div className="relative group">
                <button className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-foreground">{user?.email}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-muted transition-colors"
                  >
                    {t("signOut")}
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && isAuthenticated && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link
              href="/dashboard"
              className="block px-0 py-2 text-foreground hover:text-primary transition-colors"
            >
              {t("dashboard")}
            </Link>
            {user?.role === "admin" && (
              <>
                <Link
                  href="/dashboard/athletes"
                  className="block px-0 py-2 text-foreground hover:text-primary transition-colors"
                >
                  {t("athletes")}
                </Link>
                <Link
                  href="/dashboard/verifications"
                  className="block px-0 py-2 text-foreground hover:text-primary transition-colors"
                >
                  {t("verifications")}
                </Link>
              </>
            )}
            {(user?.role === "athlete" || user?.role === "coach") && (
              <Link
                href="/dashboard/whereabouts"
                className="block px-0 py-2 text-foreground hover:text-primary transition-colors"
              >
                {t("whereabouts")}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-0 py-2 text-foreground hover:text-primary transition-colors"
            >
              {t("signOut")}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
