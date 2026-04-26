import * as z from 'zod';

const postImageUrlSchema = z.string().trim().url('Must be a valid URL');

export const postEditorSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters').max(100, 'Destination too long'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: postImageUrlSchema.or(z.literal(''))
});

export const createPostSchema = postEditorSchema.extend({
  imageUrl: postImageUrlSchema
});

export const editPostSchema = postEditorSchema.extend({
  imageUrl: postImageUrlSchema
});

export type PostEditorFormData = z.infer<typeof postEditorSchema>;
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type EditPostFormData = z.infer<typeof editPostSchema>;
