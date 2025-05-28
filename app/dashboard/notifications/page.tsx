'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import { Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please log in to view notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationCenter userId={user._id} token={token} />
    </div>
  );
}
