import React from 'react';
import { PostsGridView } from '@/components/features/PostsGridView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { usePosts } from '@/hooks/usePosts';

export const PostsFeedContainer: React.FC = () => {
  const { data: posts = [], error: queryError, isLoading } = usePosts();
  const error = queryError instanceof Error ? queryError.message : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError message={error} />;
  }

  return (
    <PostsGridView
      emptyMessage="No posts available. Be the first to share your adventure!"
      posts={posts}
      searchPlaceholder="Search destinations, stories..."
      subtitle="Explore destinations, share your adventures, and connect with fellow travelers"
      title="Discover Amazing Travel Stories"
    />
  );
};
