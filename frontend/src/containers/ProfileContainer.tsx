import React from 'react';
import { useProfileQuery } from '@/api/queries/useProfileQuery';
import { ProfileView } from '@/components/features/ProfileView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';

export const ProfileContainer: React.FC = () => {
  const { data: user, error: queryError, isLoading } = useProfileQuery();
  const error = queryError instanceof Error ? queryError.message : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !user) {
    return <PageError message={error || 'Failed to load profile'} />;
  }

  return <ProfileView user={user} />;
};
