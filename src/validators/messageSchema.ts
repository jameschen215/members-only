import { checkSchema } from 'express-validator';

export const messageSchema = checkSchema({
  title: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'Title is required',
    },
  },
  content: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'Content is required',
    },
  },
});
