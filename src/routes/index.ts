import { Router } from 'express';

import {
  getLandingPage,
  getAllPosts,
  getPostPage,
  postNewMessage,
} from '../controllers/index.js';
import { messageSchema } from '../validators/messageSchema.js';
import { isAuthenticated } from '../auth/middleware.js';
import { validate } from '../middlewares/validate.js';

export const router = Router();

router.get('/', getAllPosts);

router.get('/landing-page', getLandingPage);

router.get('/messages/create', getPostPage);

router.post(
  '/messages/create',
  isAuthenticated,
  messageSchema,
  validate('create-form'),
  postNewMessage,
);
