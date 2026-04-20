import React from 'react';
import { useMyPostsQuery } from '@/api/queries/useMyPostsQuery';
import { PostsGridView } from '@/components/features/PostsGridView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';

export const MyPostsContainer: React.FC = () => {
  const { data: posts = [], error: queryError, isLoading } = useMyPostsQuery();
  const error = queryError instanceof Error ? queryError.message : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError message={error} />;
  }

  return (
    <PostsGridView
      currentUserId="me"
      ctaLabel="Create New Post"
      ctaTo="/posts/create"
      emptyActionLabel="Share your first post"
      emptyActionTo="/posts/create"
      emptyMessage="You haven't shared any adventures yet."
      posts={posts}
      title="My Posts"
    />
  );
};
