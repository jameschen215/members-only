import { Router } from 'express';

import {
  getAllPosts,
  getPostPage,
  postNewMessage,
} from '../controllers/index.js';
import { messageSchema } from '../validators/messageSchema.js';
import { isAuthenticated } from '../auth/middleware.js';
import { validate } from '../middlewares/validate.js';

export const router = Router();

router.get('/', isAuthenticated, getAllPosts);

// router.get('/messages/create', isAuthenticated, getPostPage);

router.post(
  '/messages/create',
  isAuthenticated,
  messageSchema,
  validate('create-form'),
  postNewMessage,
);
