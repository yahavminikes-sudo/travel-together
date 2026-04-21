import * as z from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const editPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
});

export type EditPostFormData = z.infer<typeof editPostSchema>;
