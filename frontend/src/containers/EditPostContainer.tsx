import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { EditPostForm } from '@/components/features/EditPostForm';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { usePost, useUpdatePost } from '@/hooks/usePosts';
import { EditPostFormData } from '@travel-together/shared/schemas/postSchemas';

export const EditPostContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isInitializing } = useAuth();
  const { data: post, error: queryError, isLoading } = usePost(id);
  const mutation = useUpdatePost();

  const error = queryError instanceof Error ? queryError.message : null;
  const submitError = mutation.isError ? mutation.error.message : null;

  if (!id) {
    return <PageError message="Post not found" actionLabel="Go Back" onAction={() => navigate(-1)} />;
  }

  if (isInitializing || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <PageError
        message="You need to sign in to edit a post."
        actionLabel="Go to Login"
        onAction={() => navigate('/login')}
      />
    );
  }

  if (error || !post) {
    return <PageError message={error || 'Failed to load post'} actionLabel="Go Back" onAction={() => navigate(-1)} />;
  }

  if (post.authorId !== currentUser._id) {
    return (
      <PageError
        message="You can only edit your own posts."
        actionLabel="View Post"
        onAction={() => navigate(`/posts/${id}`)}
      />
    );
  }

  const initialValues: EditPostFormData = {
    destination: post.destination,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl || '',
    tags: post.tags?.join(', ') || ''
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <EditPostForm
        initialValues={initialValues}
        isSubmitting={mutation.isPending}
        onCancel={() => navigate(-1)}
        onSubmit={(data) =>
          mutation.mutate(
            { id, data },
            {
              onSuccess: () => {
                navigate(-1);
              }
            }
          )
        }
        submitError={submitError}
      />
    </Container>
  );
};
