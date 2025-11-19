"use client";

import { AuthProvider } from "@/context/auth-provider";
import { LanguageProvider } from "@/context/language-provider";
import { ToastContainer } from "@/components/toast-container";
import { ChatWidget } from "@/components/chat-widget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
        <ToastContainer />
        <ChatWidget />
      </LanguageProvider>
    </AuthProvider>
  );
}
