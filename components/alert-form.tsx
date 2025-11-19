'use client';

import { useState } from 'react';

interface AlertFormProps {
  onSubmit: (data: { message: string; type: string; targetRole?: string }) => Promise<void>;
  loading?: boolean;
}

export function AlertForm({ onSubmit, loading = false }: AlertFormProps) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [targetRole, setTargetRole] = useState('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      message,
      type,
      targetRole: targetRole === 'all' ? undefined : targetRole,
    });
    setMessage('');
    setType('info');
    setTargetRole('all');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          placeholder="Alert message..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Alert Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Target Audience
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="all">All Users</option>
            <option value="athlete">Athletes</option>
            <option value="coach">Coaches</option>
            <option value="admin">Admins</option>
            <option value="medic">Medical Staff</option>
            <option value="nutritionist">Nutritionists</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !message}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
      >
        {loading ? 'Creating Alert...' : 'Create Alert'}
      </button>
    </form>
  );
}
