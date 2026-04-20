import React from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCreatePostMutation } from '../api/mutations/useCreatePostMutation';
import { CustomCard } from '../components/ui/CustomCard';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { createPostSchema, CreatePostFormData } from '../../../shared/schemas/postSchemas';



export const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema)
  });

  const mutation = useCreatePostMutation({
    onSuccess: (data) => {
      navigate(`/posts/${data._id}`);
    }
  });

  const onSubmit = (data: CreatePostFormData) => {
    mutation.mutate(data);
  };

  const isSubmitting = mutation.isPending;
  const error = mutation.isError ? mutation.error.message : null;

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <CustomCard className="shadow-sm border-0 p-4 p-md-5">
        <h2 className="mb-4 fw-bold">Create New Post</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
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
            <Form.Control.Feedback type="invalid">
              {errors.content?.message}
            </Form.Control.Feedback>
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
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
            <CustomButton 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </CustomButton>
          </div>
        </Form>
      </CustomCard>
    </Container>
  );
};
