import { z } from 'zod';

export const createCollaborationSchema = z.object({
  group_name: z.string().min(1, { message: 'Group name is required' }).max(100, { message: 'Group name is too long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' }),
});

export type CreateCollaborationInput = z.infer<typeof createCollaborationSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
