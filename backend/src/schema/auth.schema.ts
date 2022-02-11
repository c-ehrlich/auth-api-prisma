import { object, string, TypeOf } from 'zod';

// Validation error messages are intentionally a bit vague for auth
export const createSessionSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email or password'
    ),
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Invalid email or password'
    ),
  }),
});

export type createSessionInput = TypeOf<typeof createSessionSchema>['body'];
