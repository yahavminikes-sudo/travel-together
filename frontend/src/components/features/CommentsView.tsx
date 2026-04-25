import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useRHForm } from 'react-hook-form';
import { AvatarSize, CustomAvatar } from '@/components/ui/CustomAvatar';
import { CommentFormData, commentSchema } from '@travel-together/shared/schemas/commentSchemas';
import { Comment } from '@travel-together/shared/types/comment.types';
import React from 'react';
import { Alert, Form } from 'react-bootstrap';
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
      <div className={`${styles.card} ${styles.composer} mb-4`}>
        <h3 className={styles.composerTitle}>Add a comment</h3>

        {!canComment ? (
          <div className={styles.notice}>
            <p className={`${styles.noticeTitle} mb-1`}>Sign in to join the conversation.</p>
            <p className={`${styles.noticeCopy} mb-0`}>
              Share your thoughts, ask questions, and connect with other travelers.
            </p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            {submitError ? <Alert variant="danger" className="mb-3">{submitError}</Alert> : null}

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your thoughts..."
                className={styles.textarea}
                {...register('content')}
                isInvalid={!!errors.content}
              />
              <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
            </Form.Group>

            <div className={styles.formActions}>
              <button type="submit" disabled={isSubmitting} className={`btn btn-accent ${styles.submit}`}>
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </Form>
        )}
      </div>

      {comments.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <p className={`${styles.emptyTitle} mb-1`}>No comments yet.</p>
          <p className={`${styles.emptyCopy} mb-0`}>Be the first to share a thought about this post.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {comments.map((comment) => (
            <article key={comment._id} className={styles.item}>
              <div className={styles.itemHeader}>
                <CustomAvatar
                  size={AvatarSize.MEDIUM}
                  imageUrl={comment.author?.avatarUrl}
                  altText={comment.author?.username || 'Unknown'}
                  fallback={comment.author?.username || 'Unknown'}
                  className={styles.avatar}
                />

                <div className={styles.meta}>
                  <div className={styles.metaRow}>
                    <strong className={styles.author}>{comment.author?.username || 'Unknown'}</strong>
                    <span className={styles.date}>
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className={`${styles.content} mb-0`} style={{ whiteSpace: 'pre-wrap' }}>
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
