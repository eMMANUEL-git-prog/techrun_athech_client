'use client';

interface Verification {
  id: string;
  athleteEmail: string;
  location: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
}

interface VerificationListProps {
  verifications: Verification[];
  onApprove?: (verificationId: string) => void;
  onReject?: (verificationId: string) => void;
  loading?: boolean;
}

export function VerificationList({
  verifications,
  onApprove,
  onReject,
  loading = false,
}: VerificationListProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-3">
      {verifications.length === 0 ? (
        <p className="text-muted-foreground py-4">No submissions to verify</p>
      ) : (
        verifications.map((verification) => (
          <div
            key={verification.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-medium text-foreground">{verification.athleteEmail}</p>
                <p className="text-sm text-muted-foreground">{verification.location}</p>
                {verification.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{verification.notes}</p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ml-4 ${getStatusColor(verification.status)}`}
              >
                {verification.status}
              </span>
            </div>

            {verification.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onApprove?.(verification.id)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject?.(verification.id)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
