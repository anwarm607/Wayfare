import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.').min(8, 'Use at least 8 characters.')
    .refine((value) => value.trim().length > 0, 'Enter your password.'),
});

export type Credentials = z.infer<typeof credentialsSchema>;
