import { Router } from 'express';

import {
  deleteMessage,
  getAllPosts,
  getExplorePage,
  postNewMessage,
} from '../controllers/index.js';
import { messageSchema } from '../validators/messageSchema.js';
import { isAuthenticated, requireRole } from '../auth/middleware.js';

export const router = Router();

router.post('/messages/create', isAuthenticated, messageSchema, postNewMessage);

router.delete(
  '/messages/:messageId/delete',
  isAuthenticated,
  requireRole(['admin']),
  deleteMessage,
);

router.get('/', isAuthenticated, getAllPosts);

router.get('/search', isAuthenticated, getExplorePage);

router.get('/logo', (_req, res) => {
  res.render('logo');
});
