import * as z from 'zod';

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment too long')
});

export type CommentFormData = z.infer<typeof commentSchema>;
