export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    admin: 'Administrator',
    athlete: 'Athlete',
    coach: 'Coach',
    medic: 'Medical Staff',
    nutritionist: 'Nutritionist',
  };
  return labels[role] || role;
};

export const getRoleBadgeColor = (role: string): string => {
  const colors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    athlete: 'bg-blue-100 text-blue-800',
    coach: 'bg-green-100 text-green-800',
    medic: 'bg-orange-100 text-orange-800',
    nutritionist: 'bg-purple-100 text-purple-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};
