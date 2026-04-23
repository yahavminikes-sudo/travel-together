import React from 'react';
import { ProfileView } from '@/components/features/ProfileView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useTogglePostLike } from '@/hooks/usePosts';

export const ProfileContainer: React.FC = () => {
  const { currentUser, isAuthenticated, isInitializing } = useAuth();
  const { data: posts = [], isLoading } = usePosts();
  const toggleLikeMutation = useTogglePostLike();

  if (isInitializing || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !currentUser) {
    return <PageError message="You need to sign in to view your profile." />;
  }

  const userPosts = posts.filter((post) => post.authorId === currentUser._id);

  return (
    <ProfileView
      currentUserId={currentUser._id}
      isEditable
      onLikeToggle={(postId) => {
        void toggleLikeMutation.mutateAsync(postId);
      }}
      postCount={userPosts.length}
      posts={userPosts}
      user={currentUser}
    />
  );
};
