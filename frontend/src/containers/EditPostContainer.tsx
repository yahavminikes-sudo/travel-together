import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostQuery } from '@/api/queries/usePostQuery';
import { useUpdatePostMutation } from '@/api/mutations/useUpdatePostMutation';
import { EditPostForm } from '@/components/features/EditPostForm';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { EditPostFormData } from '../../../shared/schemas/postSchemas';

export const EditPostContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, error: queryError, isLoading } = usePostQuery(id as string);
  const mutation = useUpdatePostMutation({
    onSuccess: () => {
      navigate(`/posts/${id}`);
    },
  });

  const error = queryError instanceof Error ? queryError.message : null;
  const submitError = mutation.isError ? mutation.error.message : null;

  if (!id) {
    return (
      <PageError
        message="Post not found"
        actionLabel="Go Back"
        onAction={() => navigate(-1)}
      />
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !post) {
    return (
      <PageError
        message={error || 'Failed to load post'}
        actionLabel="Go Back"
        onAction={() => navigate(-1)}
      />
    );
  }

  const initialValues: EditPostFormData = {
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl || '',
    tags: post.tags?.join(', ') || '',
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <EditPostForm
        initialValues={initialValues}
        isSubmitting={mutation.isPending}
        onCancel={() => navigate(-1)}
        onSubmit={(data) => mutation.mutate({ id, data })}
        submitError={submitError}
      />
    </Container>
  );
};
