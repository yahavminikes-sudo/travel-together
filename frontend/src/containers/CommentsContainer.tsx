import React from 'react';
import { Spinner } from 'react-bootstrap';
import { CommentsView } from '@/components/features/CommentsView';
import { PageError } from '@/components/ui/PageError';
import { useCreateComment, useComments } from '@/hooks/usePosts';
import { CommentFormData } from '@travel-together/shared/schemas/commentSchemas';

interface CommentsContainerProps {
  postId: string;
}

export const CommentsContainer: React.FC<CommentsContainerProps> = ({ postId }) => {
  const { data: comments = [], error: queryError, isLoading } = useComments(postId);
  const mutation = useCreateComment(postId);
  const error = queryError instanceof Error ? queryError.message : null;
  const submitError = mutation.isError ? mutation.error.message : null;

  const handleSubmit = async (data: CommentFormData) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) {
    return <Spinner animation="border" size="sm" />;
  }

  if (error) {
    return <PageError className="mt-3 px-0" message={error} />;
  }

  return (
    <CommentsView
      comments={comments}
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit}
      submitError={submitError}
    />
  );
};
