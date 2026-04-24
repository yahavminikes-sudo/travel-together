import React from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '@/api';
import { PostEditorForm } from '@/components/features/PostEditorForm';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePost } from '@/hooks/usePosts';
import { CreatePostFormData } from '@travel-together/shared/schemas/postSchemas';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>('');
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const maxUploadSizeBytes = 5 * 1024 * 1024;

  const mutation = useCreatePost();

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
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return previewUrl;
    });
  };

  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      setUploadError(null);

      let imageUrl = data.imageUrl;
      if (selectedImage) {
        setIsUploadingImage(true);
        imageUrl = await uploadImage(selectedImage);
      }

      mutation.mutate(
        {
          ...data,
          imageUrl,
        },
        {
          onSuccess: (post) => {
            navigate(`/posts/${post._id}`);
          },
        }
      );
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload cover photo.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const isSubmitting = mutation.isPending || isUploadingImage;
  const error = mutation.isError ? mutation.error.message : null;

  if (!isAuthenticated) {
    return (
      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <div className="alert alert-warning mb-0" role="alert">
          You need to sign in before creating a post.
        </div>
      </div>
    );
  }

  return (
    <PostEditorForm
      mode="create"
      initialValues={{ content: '', destination: '', imageUrl: '', tags: '', title: '' }}
      isSubmitting={isSubmitting}
      onBack={() => navigate(-1)}
      onImageSelect={handleImageSelect}
      onSubmit={onSubmit}
      previewUrl={imagePreviewUrl}
      submitError={error}
      uploadError={uploadError}
    />
  );
};
