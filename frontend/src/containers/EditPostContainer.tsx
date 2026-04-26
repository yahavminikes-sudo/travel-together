import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '@/api';
import { PostEditorForm } from '@/components/features/PostEditorForm';
import { POST_IMAGE_MESSAGES } from '@/components/features/postEditor.constants';
import { validatePostImageFile } from '@/components/features/postEditor.utils';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { usePost, useUpdatePost } from '@/hooks/usePosts';
import { editPostSchema, PostEditorFormData } from '@travel-together/shared/schemas/postSchemas';

export const EditPostContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isInitializing } = useAuth();
  const { data: post, error: queryError, isLoading } = usePost(id);
  const mutation = useUpdatePost();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const error = queryError instanceof Error ? queryError.message : null;
  const submitError = mutation.isError ? mutation.error.message : null;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const validationError = validatePostImageFile(file);
    if (validationError) {
      setImageError(validationError);
      setUploadError(null);
      event.target.value = '';
      return;
    }

    setSelectedImage(file);
    setImageError(null);
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

  const initialValues: PostEditorFormData = {
    destination: post.destination,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl || ''
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
          const hasExistingImage = data.imageUrl.trim().length > 0;
          if (!selectedImage && !hasExistingImage) {
            setImageError(POST_IMAGE_MESSAGES.missing);
            return;
          }

          setImageError(null);
          setUploadError(null);

          let imageUrl = data.imageUrl;
          if (selectedImage) {
            setIsUploadingImage(true);
            imageUrl = await uploadImage(selectedImage);
          }

          const parsedData = editPostSchema.parse({
            ...data,
            imageUrl
          });

          mutation.mutate(
            { id, data: parsedData },
            {
              onSuccess: (updatedPost) => {
                navigate(`/posts/${updatedPost._id}`);
              },
            }
          );
        } catch (uploadingError) {
          setUploadError(uploadingError instanceof Error ? uploadingError.message : POST_IMAGE_MESSAGES.uploadFailed);
        } finally {
          setIsUploadingImage(false);
        }
      }}
      imageError={imageError}
      previewUrl={imagePreviewUrl}
      submitError={submitError}
      uploadError={uploadError}
    />
  );
};
