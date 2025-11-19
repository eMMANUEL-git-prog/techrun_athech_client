'use client';

import { User } from '@/context/auth-provider';
import { getRoleLabel, getRoleBadgeColor } from '@/utils/helpers';

interface AthleteListProps {
  athletes: User[];
  onSelect?: (athlete: User) => void;
}

export function AthleteList({ athletes, onSelect }: AthleteListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 text-foreground">
                {athlete.firstName && athlete.lastName
                  ? `${athlete.firstName} ${athlete.lastName}`
                  : athlete.email?.split('@')[0]}
              </td>
              <td className="px-4 py-3 text-foreground">{athlete.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(athlete.role)}`}>
                  {getRoleLabel(athlete.role)}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onSelect?.(athlete)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
