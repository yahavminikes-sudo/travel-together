import React from 'react';
import { PostsGridView } from '@/components/features/PostsGridView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { useMyPosts, useTogglePostLike } from '@/hooks/usePosts';

export const MyPostsContainer: React.FC = () => {
  const { currentUser, isAuthenticated, isInitializing } = useAuth();
  const {
    data,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useMyPosts();
  const toggleLikeMutation = useTogglePostLike();
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

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <PostsGridView
      currentUserId={currentUser._id}
      emptyActionLabel="Share your first post"
      emptyActionTo="/posts/create"
      emptyMessage="You haven't shared any adventures yet."
      onLikeToggle={(postId) => {
        void toggleLikeMutation.mutateAsync(postId);
      }}
      posts={posts}
      title="My Posts"
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      showSearch={false}
    />
  );
};
