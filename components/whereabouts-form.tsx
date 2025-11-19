'use client';

import { useState } from 'react';

interface WhereaboutsFormProps {
  onSubmit: (data: { location: string; notes: string }) => Promise<void>;
  loading?: boolean;
}

export function WhereaboutsForm({ onSubmit, loading = false }: WhereaboutsFormProps) {
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ location, notes });
    setLocation('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          placeholder="e.g., 123 Main St, City, State"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Additional Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          placeholder="Any additional information..."
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !location}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
      >
        {loading ? 'Submitting...' : 'Submit Location'}
      </button>
    </form>
  );
}
