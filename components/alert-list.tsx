'use client';

import { formatDate, formatTime } from '@/utils/helpers';

interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read?: boolean;
}

interface AlertListProps {
  alerts: Alert[];
  onMarkAsRead?: (alertId: string) => void;
}

export function AlertList({ alerts, onMarkAsRead }: AlertListProps) {
  const getAlertColor = (type: string) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      success: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="space-y-2">
      {alerts.length === 0 ? (
        <p className="text-muted-foreground py-4">No alerts</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onMarkAsRead?.(alert.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-opacity ${getAlertColor(alert.type)} ${
              alert.read ? 'opacity-75' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="font-medium">{alert.message}</p>
              <span className="text-xs opacity-75">{formatTime(alert.createdAt)}</span>
            </div>
            <p className="text-xs opacity-75 mt-1">{formatDate(alert.createdAt)}</p>
          </div>
        ))
      )}
    </div>
  );
}
