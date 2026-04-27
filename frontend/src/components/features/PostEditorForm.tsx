import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Container, Form } from 'react-bootstrap';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import * as z from 'zod';
import { createPostSchema } from '@travel-together/shared/schemas/postSchemas';
import styles from './PostEditor.module.css';

export const postEditorSchema = createPostSchema.extend({
  imageUrl: createPostSchema.shape.imageUrl.or(z.literal(''))
});

export type PostEditorFormData = z.infer<typeof postEditorSchema>;

interface PostEditorFormProps {
  mode: 'create' | 'edit';
  initialValues: PostEditorFormData;
  isSubmitting: boolean;
  onBack: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: PostEditorFormData) => Promise<void> | void;
  previewUrl?: string;
  imageError?: string | null;
  submitError?: string | null;
  uploadError?: string | null;
}

export const PostEditorForm: React.FC<PostEditorFormProps> = ({
  mode,
  initialValues,
  isSubmitting,
  onBack,
  onImageSelect,
  onSubmit,
  previewUrl,
  imageError,
  submitError,
  uploadError,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PostEditorFormData>({
    resolver: zodResolver(postEditorSchema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (!isDirty) {
      reset(initialValues);
    }
  }, [initialValues, reset, isDirty]);

  const heading = mode === 'create' ? 'Share Your Adventure' : 'Edit Your Adventure';
  const submitLabel = mode === 'create' ? 'Publish Post' : 'Save Changes';
  const submittingLabel = mode === 'create' ? 'Publishing...' : 'Saving...';

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <button
        type="button"
        className="btn btn-link text-decoration-none text-dark px-0 mb-3 d-inline-flex align-items-center gap-2"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white border rounded-4 shadow-sm p-4 p-md-4">
        <h2 className="mb-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem' }}>
          {heading}
        </h2>

        {submitError ? <Alert variant="danger">{submitError}</Alert> : null}
        {uploadError ? <Alert variant="danger">{uploadError}</Alert> : null}

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
            <label className={styles.upload} htmlFor={`cover-photo-input-${mode}`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Cover preview" className={styles.uploadPreview} />
              ) : (
                <div className={styles.uploadEmpty}>
                  <ImagePlus size={36} />
                  <span>Click to upload a photo</span>
                </div>
              )}
            </label>
            <Form.Control
              id={`cover-photo-input-${mode}`}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={onImageSelect}
            />
            {imageError || errors.imageUrl?.message ? (
              <div className="invalid-feedback d-block">{imageError || errors.imageUrl?.message}</div>
            ) : null}
          </Form.Group>

          <button type="submit" className="btn btn-accent w-100 py-2 fs-5" disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </Form>
      </div>
    </Container>
  );
};
