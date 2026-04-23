import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useRHForm } from 'react-hook-form';
import { Alert, Form } from 'react-bootstrap';
import { Comment } from '@travel-together/shared/types/comment.types';
import { commentSchema, CommentFormData } from '@travel-together/shared/schemas/commentSchemas';
import { AvatarSize, CustomAvatar } from '@/components/ui/CustomAvatar';

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
    <div className="travel-comments-wrap">
      <div className="travel-comments-card travel-comments-composer mb-4">
        <h3 className="travel-comments-composer-title">Add a comment</h3>

        {!canComment ? (
          <div className="travel-comments-notice">
            <p className="travel-comments-notice-title mb-1">Sign in to join the conversation.</p>
            <p className="travel-comments-notice-copy mb-0">
              Share your thoughts, ask questions, and connect with other travelers.
            </p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(handleFormSubmit)} className="travel-comments-form">
            {submitError ? <Alert variant="danger" className="mb-3">{submitError}</Alert> : null}

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your thoughts..."
                className="travel-comments-textarea"
                {...register('content')}
                isInvalid={!!errors.content}
              />
              <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
            </Form.Group>

            <div className="travel-comments-form-actions">
              <button type="submit" disabled={isSubmitting} className="btn btn-accent travel-comments-submit">
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </Form>
        )}
      </div>

      {comments.length === 0 ? (
        <div className="travel-comments-card travel-comments-empty">
          <p className="travel-comments-empty-title mb-1">No comments yet.</p>
          <p className="travel-comments-empty-copy mb-0">Be the first to share a thought about this post.</p>
        </div>
      ) : (
        <div className="travel-comments-list">
          {comments.map((comment) => (
            <article key={comment._id} className="travel-comments-item">
              <div className="travel-comments-item-header">
                <CustomAvatar
                  size={AvatarSize.MEDIUM}
                  imageUrl={comment.author?.avatarUrl}
                  altText={comment.author?.username || 'Unknown'}
                  fallback={comment.author?.username || 'Unknown'}
                  className="travel-comments-avatar"
                />

                <div className="travel-comments-meta">
                  <div className="travel-comments-meta-row">
                    <strong className="travel-comments-author">{comment.author?.username || 'Unknown'}</strong>
                    <span className="travel-comments-date">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="travel-comments-content mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
