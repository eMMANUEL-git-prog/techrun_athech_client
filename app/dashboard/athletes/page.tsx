'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AthleteList } from '@/components/athlete-list';
import { api } from '@/lib/api';
import { User } from '@/context/auth-provider';
import { showToast } from '@/lib/toast';

export default function AthletesPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [athletes, setAthletes] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, user, router]);

  useEffect(() => {
    const loadAthletes = async () => {
      try {
        const response = await api.athletes.getAll();
        setAthletes(response.data.athletes || []);
      } catch (error) {
        console.error('Error loading athletes:', error);
        showToast('Failed to load athletes', 'error');
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && !loading && user?.role === 'admin') {
      loadAthletes();
    }
  }, [isAuthenticated, loading, user]);

  const filteredAthletes = athletes.filter((athlete) =>
    athlete.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (athlete.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (athlete.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Loading athletes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Athletes</h1>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Add Athlete
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search athletes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <AthleteList athletes={filteredAthletes} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
