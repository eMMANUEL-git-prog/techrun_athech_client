"use client";

import type React from "react";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { subscriptionPlans } from "@/lib/subscription-plans";
import { showToast } from "@/lib/toast";
import { Loader, Check, Smartphone } from "lucide-react";
import { api } from "@/lib/api";

type PaymentMethod = "mpesa" | "card" | "paypal";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);

  const [pageLoading, setPageLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [waitingForMpesa, setWaitingForMpesa] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    phoneNumber: "",
  });

  const plan = planId ? subscriptionPlans.find((p) => p.id === planId) : null;
  const tax = plan ? Math.round(plan.price * 10) / 100 : 0;
  const total = plan ? plan.price + tax : 0;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
    setPageLoading(false);
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!plan) {
      router.push("/packages");
    }
  }, [plan, router]);

  useEffect(() => {
    if (!checkoutRequestId || !waitingForMpesa) return;

    const pollPaymentStatus = async () => {
      try {
        const response = await api.payments.getTransactions();
        const transaction = response.data.transactions.find(
          (t: any) => t.checkout_request_id === checkoutRequestId
        );

        if (transaction) {
          if (transaction.status === "completed") {
            setWaitingForMpesa(false);
            setPaymentSuccess(true);
            showToast("Payment successful! Subscription activated.", "success");

            // Redirect after success
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          } else if (transaction.status === "failed") {
            setWaitingForMpesa(false);
            setProcessing(false);
            showToast("Payment failed. Please try again.", "error");
          }
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(pollPaymentStatus, 3000);

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (waitingForMpesa) {
        setWaitingForMpesa(false);
        setProcessing(false);
        showToast(
          "Payment timeout. Please check your phone and try again.",
          "error"
        );
      }
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [checkoutRequestId, waitingForMpesa, router]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (selectedPayment === "mpesa") {
        // Validate phone number format
        const phoneNumber = formData.phoneNumber.replace(/\s/g, "");
        if (!phoneNumber.match(/^(\+?254|0)[17]\d{8}$/)) {
          showToast(
            "Invalid phone number. Use format: 254712345678 or 0712345678",
            "error"
          );
          setProcessing(false);
          return;
        }

        // Format phone number to 254XXXXXXXXX
        const formattedPhone = phoneNumber.startsWith("+")
          ? phoneNumber.substring(1)
          : phoneNumber.startsWith("0")
          ? "254" + phoneNumber.substring(1)
          : phoneNumber;

        // Initiate STK push
        const response = await api.payments.initiateMpesa({
          phone_number: formattedPhone,
          amount: Math.round(total),
          package_type: plan?.tier || "pro",
        });

        if (response.data.checkout_request_id) {
          setCheckoutRequestId(response.data.checkout_request_id);
          setWaitingForMpesa(true);
          showToast(
            "STK push sent! Please check your phone and enter your M-Pesa PIN.",
            "success"
          );
        }
      } else {
        setTimeout(() => {
          setProcessing(false);
          setPaymentSuccess(true);
          showToast("Payment successful! Subscription activated.", "success");

          // Redirect after success
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      showToast(
        error.response?.data?.error || "Payment failed. Please try again.",
        "error"
      );
      setProcessing(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {t("confirmSubscription")}
        </h1>

        {waitingForMpesa && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Check Your Phone
              </h2>
              <p className="text-muted-foreground mb-6">
                An M-Pesa payment prompt has been sent to your phone. Please
                enter your PIN to complete the payment.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader className="w-4 h-4 animate-spin" />
                Waiting for payment confirmation...
              </div>
            </div>
          </div>
        )}

        {paymentSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t("paymentSuccessful")}
              </h2>
              <p className="text-muted-foreground mb-6">
                Your subscription to {plan?.name} plan has been activated.
                Redirecting...
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("selectPaymentMethod")}
              </h2>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { id: "mpesa" as const, name: t("mpesa") },
                  { id: "card" as const, name: t("card") },
                  { id: "paypal" as const, name: t("paypal") },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">
                      {method.name}
                    </p>
                  </button>
                ))}
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {selectedPayment === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("cardNumber")}
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("expiry")}
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={(e) =>
                            setFormData({ ...formData, expiry: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("cvv")}
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData({ ...formData, cvv: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayment === "mpesa" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("phoneNumber")}
                    </label>
                    <input
                      type="tel"
                      placeholder="254712345678 or 0712345678"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                      required
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enter your Safaricom M-Pesa number. You'll receive an STK
                      push prompt on your phone.
                    </p>
                  </div>
                )}

                {selectedPayment === "paypal" && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      You will be redirected to PayPal to complete the payment
                      securely.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing || waitingForMpesa}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing || waitingForMpesa ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      {waitingForMpesa
                        ? "Waiting for M-Pesa..."
                        : t("processingPayment")}
                    </>
                  ) : (
                    t("completePayment")
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-lg p-8 sticky top-8">
              <h3 className="text-xl font-bold text-foreground mb-6">
                {t("orderSummary")}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>{t("plan")}:</span>
                  <span className="font-semibold">{plan?.name}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>{t("subtotal")}:</span>
                  <span>Ksh.{plan?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>{t("tax")}:</span>
                  <span>Ksh.{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">
                    {t("total")}:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    Ksh.{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-green-900 dark:text-green-100">
                  You will have immediate access to all {plan?.name} features
                  after payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
