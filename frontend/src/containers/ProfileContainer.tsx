import React from 'react';
import { ProfileView } from '@/components/features/ProfileView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';

export const ProfileContainer: React.FC = () => {
  const { currentUser, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !currentUser) {
    return <PageError message="You need to sign in to view your profile." />;
  }

  return <ProfileView user={currentUser} />;
};
