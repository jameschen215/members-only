import { Router } from 'express';

import {
  deleteMessage,
  getAllPosts,
  // getPostPage,
  postNewMessage,
} from '../controllers/index.js';
import { messageSchema } from '../validators/messageSchema.js';
import { isAuthenticated, requireRole } from '../auth/middleware.js';
import { validate } from '../middlewares/validate.js';

export const router = Router();

router.get('/', isAuthenticated, getAllPosts);

// router.get('/messages/create', isAuthenticated, getPostPage);

router.post('/messages/create', isAuthenticated, messageSchema, postNewMessage);

router.delete(
  '/messages/:messageId/delete',
  isAuthenticated,
  requireRole(['admin']),
  deleteMessage,
);
