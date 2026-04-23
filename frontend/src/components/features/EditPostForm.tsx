import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Form } from 'react-bootstrap';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard } from '@/components/ui/CustomCard';
import { CustomInput } from '@/components/ui/CustomInput';
import { editPostSchema, EditPostFormData } from '@travel-together/shared/schemas/postSchemas';

interface EditPostFormProps {
  initialValues: EditPostFormData;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (data: EditPostFormData) => void;
  submitError?: string | null;
}

export const EditPostForm: React.FC<EditPostFormProps> = ({
  initialValues,
  isSubmitting,
  onCancel,
  onSubmit,
  submitError,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <CustomCard className="shadow-sm border-0 p-4 p-md-5">
      <h2 className="mb-4 fw-bold">Edit Post</h2>

      {submitError ? <Alert variant="danger">{submitError}</Alert> : null}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          label="Title"
          type="text"
          placeholder="Give your adventure a catchy title"
          error={errors.title?.message}
          {...register('title')}
        />

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium text-dark">Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Tell us about your travel experience..."
            isInvalid={!!errors.content}
            {...register('content')}
            style={{ borderRadius: '0.5rem', resize: 'vertical' }}
          />
          <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
        </Form.Group>

        <CustomInput
          label="Image URL (Optional)"
          type="url"
          placeholder="https://example.com/image.jpg"
          error={errors.imageUrl?.message}
          {...register('imageUrl')}
        />

        <CustomInput
          label="Tags (Optional)"
          type="text"
          placeholder="Comma separated tags (e.g. paris, food, hiking)"
          error={errors.tags?.message}
          {...register('tags')}
          hint="Separate multiple tags with commas"
        />

        <div className="d-flex justify-content-end gap-3 mt-4">
          <CustomButton
            type="button"
            variant="outline-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </CustomButton>
        </div>
      </Form>
    </CustomCard>
  );
};
