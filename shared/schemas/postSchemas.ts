import * as z from 'zod';

export const postEditorSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters').max(100, 'Destination too long'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().optional()
});

export const createPostSchema = postEditorSchema;
export const editPostSchema = postEditorSchema;

export type PostEditorFormData = z.infer<typeof postEditorSchema>;
export type CreatePostFormData = PostEditorFormData;
export type EditPostFormData = PostEditorFormData;
