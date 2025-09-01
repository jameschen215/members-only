import { Router } from 'express';

import { getLandingPage, getAllPosts } from '../controllers/index.js';

export const router = Router();

router.get('/', getAllPosts);

router.get('/landing-page', getLandingPage);
