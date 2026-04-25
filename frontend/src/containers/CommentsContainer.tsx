import React from 'react';
import { Spinner } from 'react-bootstrap';
import { CommentsView } from '@/components/features/CommentsView';
import { PageError } from '@/components/ui/PageError';
import { useAuth } from '@/hooks/useAuth';
import { useCreateComment, useComments, useDeleteComment } from '@/hooks/usePosts';
import { CommentFormData } from '@travel-together/shared/schemas/commentSchemas';

interface CommentsContainerProps {
  postId: string;
}

export const CommentsContainer: React.FC<CommentsContainerProps> = ({ postId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { data: comments = [], error: queryError, isLoading } = useComments(postId);
  const createCommentMutation = useCreateComment(postId);
  const deleteCommentMutation = useDeleteComment(postId);
  const error = queryError instanceof Error ? queryError.message : null;
  const submitError = createCommentMutation.isError ? createCommentMutation.error.message : null;
  const deleteError = deleteCommentMutation.isError ? deleteCommentMutation.error.message : null;

  const handleSubmit = async (data: CommentFormData) => {
    if (!isAuthenticated) {
      throw new Error('You need to sign in to post a comment.');
    }

    await createCommentMutation.mutateAsync(data);
  };

  const handleDelete = async (commentId: string) => {
    if (!isAuthenticated) {
      throw new Error('You need to sign in to delete a comment.');
    }

    await deleteCommentMutation.mutateAsync(commentId);
  };

  if (isLoading) {
    return <Spinner animation="border" size="sm" />;
  }

  if (error) {
    return <PageError className="mt-3 px-0" message={error} />;
  }

  return (
    <CommentsView
      canComment={isAuthenticated}
      comments={comments}
      currentUserId={currentUser?._id}
      deleteError={deleteError}
      deletingCommentId={deleteCommentMutation.variables}
      isDeleting={deleteCommentMutation.isPending}
      isSubmitting={createCommentMutation.isPending}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      submitError={submitError}
    />
  );
};
