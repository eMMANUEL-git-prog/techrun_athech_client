"use client";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Users, Package, Settings } from "lucide-react";
import { NotificationDropdown } from "@/components/notification-dropdown";

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
    <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <img src="/logo.png" alt="" className="h-10" />
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {t("dashboard")}
              </Link>
              {user?.role === "admin" && (
                <>
                  <Link
                    href="/dashboard/athletes"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {t("athletes")}
                  </Link>
                  <Link
                    href="/dashboard/verifications"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {t("verifications")}
                  </Link>
                  <Link
                    href="/dashboard/users"
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
                  >
                    <Users className="w-4 h-4" />
                    {t("manage")}
                  </Link>
                </>
              )}
              {(user?.role === "athlete" || user?.role === "coach") && (
                <Link
                  href="/dashboard/whereabouts"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {t("whereabouts")}
                </Link>
              )}
              <Link
                href="/packages"
                className="text-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
              >
                <Package className="w-4 h-4" />
                {t("premium")}
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            {isAuthenticated && <NotificationDropdown />}

            {/* Language Selector */}
            <div className="relative group">
              <button className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted font-medium">
                {language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {(["en", "es", "fr", "sw"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      language === lang
                        ? "text-primary font-semibold bg-muted"
                        : "text-foreground"
                    }`}
                  >
                    {lang === "en"
                      ? "English"
                      : lang === "es"
                      ? "Español"
                      : lang === "fr"
                      ? "Français"
                      : "Swahili"}
                  </button>
                ))}
              </div>
            </div>

            {/* User profile menu */}
            {isAuthenticated && (
              <div className="relative group">
                <button className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-foreground truncate">
                      {user?.email}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                    {user?.subscription && user.subscription !== "free" && (
                      <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                        {user.subscription.toUpperCase()} PLAN
                      </span>
                    )}
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-muted transition-colors rounded-b-lg"
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
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-2">
            <Link
              href="/dashboard"
              className="block px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("dashboard")}
            </Link>
            {user?.role === "admin" && (
              <>
                <Link
                  href="/dashboard/athletes"
                  className="block px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  {t("athletes")}
                </Link>
                <Link
                  href="/dashboard/verifications"
                  className="block px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  {t("verifications")}
                </Link>
                <Link
                  href="/dashboard/users"
                  className="block px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  {t("manage")}
                </Link>
              </>
            )}
            {(user?.role === "athlete" || user?.role === "coach") && (
              <Link
                href="/dashboard/whereabouts"
                className="block px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                {t("whereabouts")}
              </Link>
            )}
            <Link
              href="/packages"
              className="block px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("premium")}
            </Link>
            <Link
              href="/settings"
              className="block px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-0 py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("signOut")}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
