import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostDetailView } from '@/components/features/PostDetailView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { usePost } from '@/hooks/usePosts';

export const PostDetailContainer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { data: post, error: queryError, isLoading } = usePost(id);
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

  return <PostDetailView currentUserId={currentUser?._id} post={post} onBack={() => navigate(-1)} />;
};
