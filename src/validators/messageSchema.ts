import { checkSchema } from 'express-validator';

export const messageSchema = checkSchema({
  title: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'Title is required',
    },
    isLength: {
      options: { max: 50 },
      errorMessage: 'Title must be at most 50 characters long',
    },
  },
  content: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'Content is required',
    },
    isLength: {
      options: { max: 300 },
      errorMessage: 'Content must be at most 300 characters long',
    },
  },
});
