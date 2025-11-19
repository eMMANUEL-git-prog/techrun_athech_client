'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AlertList } from '@/components/alert-list';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';

export default function AlertsPage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await api.alerts.getAll();
        setAlerts(response.data.alerts || []);
      } catch (error) {
        console.error('Error loading alerts:', error);
        showToast('Failed to load alerts', 'error');
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && !loading) {
      loadAlerts();
    }
  }, [isAuthenticated, loading]);

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Alerts</h1>

        <div className="space-y-4">
          <AlertList alerts={alerts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
