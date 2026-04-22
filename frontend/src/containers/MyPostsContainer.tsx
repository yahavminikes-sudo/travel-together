import React from 'react';
import { PostsGridView } from '@/components/features/PostsGridView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { useMyPosts } from '@/hooks/usePosts';

export const MyPostsContainer: React.FC = () => {
  const { currentUser, isAuthenticated, isInitializing } = useAuth();
  const { data: posts = [], error: queryError, isLoading } = useMyPosts();
  const error = queryError instanceof Error ? queryError.message : null;

  if (isInitializing || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !currentUser) {
    return <PageError message="You need to sign in to view your posts." />;
  }

  if (error) {
    return <PageError message={error} />;
  }

  return (
    <PostsGridView
      currentUserId={currentUser._id}
      emptyActionLabel="Share your first post"
      emptyActionTo="/posts/create"
      emptyMessage="You haven't shared any adventures yet."
      posts={posts}
      title="My Posts"
    />
  );
};
