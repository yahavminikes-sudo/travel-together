import { uploadImage } from '@/api';
import styles from '@/components/features/PostEditor.module.css';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePost } from '@/hooks/usePosts';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePostFormData, createPostSchema } from '@travel-together/shared/schemas/postSchemas';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import React from 'react';
import { Alert, Container, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>('');
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const maxUploadSizeBytes = 5 * 1024 * 1024;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema)
  });

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
          imageUrl
        },
        {
          onSuccess: (post) => {
            navigate(`/posts/${post._id}`);
          }
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
      <Container className="py-5" style={{ maxWidth: '800px' }}>
        <Alert variant="warning" className="mb-0">
          You need to sign in before creating a post.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <button
        type="button"
        className="btn btn-link text-decoration-none text-dark px-0 mb-3 d-inline-flex align-items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white border rounded-4 shadow-sm p-4 p-md-4">
        <h2 className="mb-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem' }}>
          Share Your Adventure
        </h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {uploadError && <Alert variant="danger">{uploadError}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="My Amazing Trip to..."
              isInvalid={!!errors.title}
              {...register('title')}
            />
            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              placeholder="Paris, France"
              isInvalid={!!errors.destination}
              {...register('destination')}
            />
            <Form.Control.Feedback type="invalid">{errors.destination?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Your Story</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              placeholder="Tell us about your experience..."
              isInvalid={!!errors.content}
              {...register('content')}
              style={{ borderRadius: '0.5rem', resize: 'vertical', minHeight: 220 }}
            />
            <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Cover Photo</Form.Label>
            <label className={styles.upload} htmlFor="cover-photo-input">
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Cover preview" className={styles.uploadPreview} />
              ) : (
                <div className={styles.uploadEmpty}>
                  <ImagePlus size={36} />
                  <span>Click to upload a photo</span>
                </div>
              )}
            </label>
            <Form.Control
              id="cover-photo-input"
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handleImageSelect}
            />
            {errors.imageUrl?.message ? (
              <div className="invalid-feedback d-block">{errors.imageUrl.message}</div>
            ) : null}
          </Form.Group>

          <button type="submit" className="btn btn-accent w-100 py-2 fs-5" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </Form>
      </div>
    </Container>
  );
};
