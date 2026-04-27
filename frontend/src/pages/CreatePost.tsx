import { uploadImage } from '@/api';
import { PostEditorForm } from '@/components/features/PostEditorForm';
import { POST_IMAGE_MESSAGES } from '@/components/features/postEditor.constants';
import { validatePostImageFile } from '@/components/features/postEditor.utils';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePost } from '@/hooks/usePosts';
import { createPostSchema } from '@travel-together/shared/schemas/postSchemas';
import { PostEditorFormData } from '@/components/features/PostEditorForm';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const createPostInitialValues: PostEditorFormData = {
  content: '',
  destination: '',
  imageUrl: '',
  title: '',
};

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>('');
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const mutation = useCreatePost();

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

  const onSubmit = async (data: PostEditorFormData) => {
    try {
      if (!selectedImage) {
        setImageError(POST_IMAGE_MESSAGES.missing);
        return;
      }

      setImageError(null);
      setUploadError(null);
      setIsUploadingImage(true);
      const imageUrl = await uploadImage(selectedImage);
      const parsedData = createPostSchema.parse({
        ...data,
        imageUrl
      });

      mutation.mutate(
        parsedData,
        {
          onSuccess: (post) => {
            navigate(`/posts/${post._id}`);
          }
        }
      );
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : POST_IMAGE_MESSAGES.uploadFailed);
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
      initialValues={createPostInitialValues}
      isSubmitting={isSubmitting}
      onBack={() => navigate(-1)}
      onImageSelect={handleImageSelect}
      onSubmit={onSubmit}
      imageError={imageError}
      previewUrl={imagePreviewUrl}
      submitError={error}
      uploadError={uploadError}
    />
  );
};
