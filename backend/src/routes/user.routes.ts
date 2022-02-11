import express from 'express';
import {
  createUserHandler,
  verifyUserHandler,
} from '../controller/user.controller';
import validateResource from '../middleware/validateResource';
import { createUserSchema, verifyUserSchema } from '../schema/user.schema';

const router = express.Router();

router.post(
  '/api/users',
  validateResource(createUserSchema),
  createUserHandler
);

// TODO his endpoint should probably be a GET request, because users are clicking on a link in an email
router.post(
  '/api/users/verify/:id/:verificationCode',
  validateResource(verifyUserSchema),
  verifyUserHandler
);

export default router;
