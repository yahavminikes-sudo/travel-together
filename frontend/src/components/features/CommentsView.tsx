import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useRHForm } from 'react-hook-form';
import { Alert, Form, ListGroup } from 'react-bootstrap';
import { Comment } from '@travel-together/shared/types/comment.types';
import { CustomButton } from '@/components/ui/CustomButton';
import { commentSchema, CommentFormData } from '@travel-together/shared/schemas/commentSchemas';

interface CommentsViewProps {
  comments: Comment[];
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (data: CommentFormData) => Promise<void>;
}

export const CommentsView: React.FC<CommentsViewProps> = ({
  comments,
  isSubmitting,
  submitError,
  onSubmit,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useRHForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const handleFormSubmit = async (data: CommentFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="mt-5">
      <h3 className="mb-4">Comments</h3>

      {submitError ? <Alert variant="danger">{submitError}</Alert> : null}

      <Form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Add a comment..."
            {...register('content')}
            isInvalid={!!errors.content}
          />
          <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
        </Form.Group>
        <CustomButton type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </CustomButton>
      </Form>

      {comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first to comment!</p>
      ) : (
        <ListGroup variant="flush">
          {comments.map((comment) => (
            <ListGroup.Item key={comment._id} className="bg-transparent px-0 py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <strong className="text-dark">{comment.author?.username || 'Unknown'}</strong>
                <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>
              </div>
              <p className="mb-0 text-secondary">{comment.content}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};
