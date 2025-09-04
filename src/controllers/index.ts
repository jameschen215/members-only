import { RequestHandler } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { CreateMessageType, MessageWithAuthor } from '../types/message.js';
import { createMessage, getAllMessages } from '../models/message.js';

export const getAllPosts: RequestHandler = async (req, res, next) => {
  try {
    const messages = await getAllMessages();
    const messagesWithAuthor: MessageWithAuthor[] = messages.map((message) => ({
      ...message,
      author: res.locals.currentUser,
    }));

    res.render('index', { messages: messagesWithAuthor });
  } catch (error) {
    next(error);
  }
};

// export const getPostPage: RequestHandler = (req, res) => {
//   res.render('create-form', { errors: null, oldInput: null });
// };

export const postNewMessage: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ errors: errors.mapped(), oldInput: req.body });
  }

  const formData = matchedData(req) as CreateMessageType;

  try {
    await createMessage(
      formData.title,
      formData.content,
      res.locals.currentUser.id,
    );

    res.status(210).json({ success: true });
  } catch (error) {
    next(error);
  }
};
