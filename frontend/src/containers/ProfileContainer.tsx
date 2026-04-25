import React from 'react';
import { ProfileView } from '@/components/features/ProfileView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { useMyPosts, useTogglePostLike } from '@/hooks/usePosts';

export const ProfileContainer: React.FC = () => {
  const { currentUser, isAuthenticated, isInitializing } = useAuth();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMyPosts();
  const toggleLikeMutation = useTogglePostLike();

  if (isInitializing || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !currentUser) {
    return <PageError message="You need to sign in to view your profile." />;
  }

  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;

  return (
    <ProfileView
      currentUserId={currentUser._id}
      isEditable
      onLikeToggle={(postId) => {
        void toggleLikeMutation.mutateAsync(postId);
      }}
      postCount={totalCount}
      posts={posts}
      user={currentUser}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};
