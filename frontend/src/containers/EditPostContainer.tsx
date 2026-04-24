import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '@/api';
import { PostEditorForm } from '@/components/features/PostEditorForm';
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
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const maxUploadSizeBytes = 5 * 1024 * 1024;

  const error = queryError instanceof Error ? queryError.message : null;
  const submitError = mutation.isError ? mutation.error.message : null;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > maxUploadSizeBytes) {
      setUploadError('Cover photo is too large. Please choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setSelectedImage(file);
    setUploadError(null);

    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentUrl);
      }

      return previewUrl;
    });
  };

  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  React.useEffect(() => {
    if (post?.imageUrl) {
      setImagePreviewUrl(post.imageUrl);
    } else {
      setImagePreviewUrl('');
    }
  }, [post?.imageUrl]);

  if (!id) {
    return (
      <PageError
        message="Post not found"
        actionLabel="Go Back"
        onAction={() => navigate(-1)}
      />
    );
  }

  if (isInitializing || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !currentUser) {
    return <PageError message="You need to sign in to edit a post." actionLabel="Go to Login" onAction={() => navigate('/login')} />;
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
    tags: post.tags?.join(', ') || '',
  };

  return (
    <PostEditorForm
      mode="edit"
      initialValues={initialValues}
      isSubmitting={mutation.isPending || isUploadingImage}
      onBack={() => navigate(-1)}
      onImageSelect={handleImageSelect}
      onSubmit={async (data) => {
        try {
          setUploadError(null);

          let imageUrl = data.imageUrl;
          if (selectedImage) {
            setIsUploadingImage(true);
            imageUrl = await uploadImage(selectedImage);
          }

          mutation.mutate(
            { id, data: { ...data, imageUrl } },
            {
              onSuccess: (updatedPost) => {
                navigate(`/posts/${updatedPost._id}`);
              },
            }
          );
        } catch (uploadingError) {
          setUploadError(uploadingError instanceof Error ? uploadingError.message : 'Failed to upload cover photo.');
        } finally {
          setIsUploadingImage(false);
        }
      }}
      previewUrl={imagePreviewUrl}
      submitError={submitError}
      uploadError={uploadError}
    />
  );
};
