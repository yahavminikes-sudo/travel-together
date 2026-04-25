import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential is required')
});

export type GoogleAuthFormData = z.infer<typeof googleAuthSchema>;

const registerFieldsSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerRequestSchema = registerFieldsSchema;

export type RegisterRequestData = z.infer<typeof registerRequestSchema>;

export const registerSchema = registerFieldsSchema
  .extend({
    confirmPassword: z.string()
  })
  .refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
