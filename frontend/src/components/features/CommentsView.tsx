import { zodResolver } from '@hookform/resolvers/zod';
import { CommentFormData, commentSchema } from '@travel-together/shared/schemas/commentSchemas';
import { Comment } from '@travel-together/shared/types/comment.types';
import { MessageCircle } from 'lucide-react';
import React from 'react';
import { Alert, Form, ListGroup } from 'react-bootstrap';
import { useForm as useRHForm } from 'react-hook-form';
import styles from './CommentsView.module.css';

interface CommentsViewProps {
  canComment: boolean;
  comments: Comment[];
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (data: CommentFormData) => Promise<void>;
}

export const CommentsView: React.FC<CommentsViewProps> = ({
  canComment,
  comments,
  isSubmitting,
  submitError,
  onSubmit
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useRHForm<CommentFormData>({
    resolver: zodResolver(commentSchema)
  });

  const handleFormSubmit = async (data: CommentFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className={styles.wrap}>
      <div className={`${styles.card} mb-4`}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <MessageCircle size={18} />
          <h3 className="mb-0 fs-5">Join the conversation</h3>
        </div>

        {!canComment ? (
          <Alert variant="light" className="mb-0 border">
            Sign in to add a comment.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit(handleFormSubmit)}>
            {submitError ? <Alert variant="danger">{submitError}</Alert> : null}

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Share your thoughts about this post..."
                {...register('content')}
                isInvalid={!!errors.content}
              />
              <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
            </Form.Group>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </Form>
        )}
      </div>

      {comments.length === 0 ? (
        <div className={styles.card}>
          <p className="text-muted mb-0">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <ListGroup variant="flush" className={styles.list}>
          {comments.map((comment) => (
            <ListGroup.Item key={comment._id} className={styles.item}>
              <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                <div>
                  <strong className="text-dark">{comment.author?.username || 'Unknown'}</strong>
                  <div>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                </div>
              </div>
              <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {comment.content}
              </p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};
