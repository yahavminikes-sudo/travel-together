import React from 'react';
import { usePostsQuery } from '@/api/queries/usePostsQuery';
import { PostsGridView } from '@/components/features/PostsGridView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';

export const PostsFeedContainer: React.FC = () => {
  const { data: posts = [], error: queryError, isLoading } = usePostsQuery();
  const error = queryError instanceof Error ? queryError.message : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError message={error} />;
  }

  return (
    <PostsGridView
      ctaLabel="Share Post"
      ctaTo="/posts/create"
      emptyMessage="No posts available. Be the first to share your adventure!"
      posts={posts}
      title="Latest Adventures"
    />
  );
};
