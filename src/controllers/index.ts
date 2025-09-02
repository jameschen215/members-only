import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
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

export const getPostPage: RequestHandler = (req, res) => {
  res.render('create-form', { errors: null, oldInput: null });
};

export const postNewMessage: RequestHandler = async (req, res, next) => {
  console.log(req.body);
  const formData = matchedData(req) as CreateMessageType;

  console.log({ formData });

  try {
    await createMessage(
      formData.title,
      formData.content,
      res.locals.currentUser.id,
    );

    res.status(210).redirect('/');
  } catch (error) {
    next(error);
  }
};
