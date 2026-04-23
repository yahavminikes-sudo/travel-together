import React from 'react';
import { PostsGridView } from '@/components/features/PostsGridView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useTogglePostLike } from '@/hooks/usePosts';

export const PostsFeedContainer: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: posts = [], error: queryError, isLoading } = usePosts();
  const toggleLikeMutation = useTogglePostLike();
  const error = queryError instanceof Error ? queryError.message : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError message={error} />;
  }

  return (
    <PostsGridView
      currentUserId={currentUser?._id}
      emptyMessage="No posts available. Be the first to share your adventure!"
      onLikeToggle={(postId) => {
        void toggleLikeMutation.mutateAsync(postId);
      }}
      posts={posts}
      searchPlaceholder="Search destinations, stories..."
      subtitle="Explore destinations, share your adventures, and connect with fellow travelers"
      title="Discover Amazing Travel Stories"
    />
  );
};
