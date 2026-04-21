import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostQuery } from '@/api/queries/usePostQuery';
import { PostDetailView } from '@/components/features/PostDetailView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';

export const PostDetailContainer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: post, error: queryError, isLoading } = usePostQuery(id as string);
  const error = queryError instanceof Error ? queryError.message : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !post || !id) {
    return (
      <PageError
        message={error || 'Post not found'}
        actionLabel="Go Back"
        onAction={() => navigate(-1)}
      />
    );
  }

  return <PostDetailView post={post} onBack={() => navigate(-1)} />;
};
