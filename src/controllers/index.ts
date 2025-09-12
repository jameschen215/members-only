import { RequestHandler } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { CreateMessageType, MessageWithAuthor } from '../types/message.js';
import {
  createMessage,
  deleteMessageById,
  getAllMessages,
} from '../models/message.js';
import { PublicUserType } from '../types/user.js';
import { getAllUsers } from '../models/user.js';
import { highlightMatches } from '../lib/utils.js';

export const getAllPosts: RequestHandler = async (_req, res, next) => {
  try {
    const messages: MessageWithAuthor[] = await getAllMessages();

    res.render('index', { messages });
  } catch (error) {
    next(error);
  }
};

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

export const deleteMessage: RequestHandler = async (req, res, next) => {
  const messageId = Number(req.params.messageId);
  const returnTo = typeof req.query.from === 'string' ? req.query.from : '/';

  console.log({ returnTo });

  try {
    await deleteMessageById(messageId);

    res.redirect(returnTo);
  } catch (error) {
    next(error);
  }
};

export const getExplorePage: RequestHandler = async (req, res, _next) => {
  const { q, tab = 'messages' } = req.query;

  const searchTerm = typeof q === 'string' ? q.trim() : String(q || '').trim();
  let messages: MessageWithAuthor[] = [];
  let users: PublicUserType[] = [];

  // Only search if there's a query term
  if (q && searchTerm) {
    if (tab === 'messages') {
      messages = await getAllMessages(searchTerm);
    } else {
      users = await getAllUsers(searchTerm);
    }
  }

  const highlightedMessages = messages.map((msg) => ({
    ...msg,
    title: highlightMatches(msg.title, searchTerm),
    content: highlightMatches(msg.content, searchTerm),
  }));

  const highlightedUsers = users.map((user) => ({
    ...user,
    avatar: user.first_name.charAt(0) + user.last_name.charAt(0),
    first_name: highlightMatches(user.first_name, searchTerm),
    last_name: highlightMatches(user.last_name, searchTerm),
    username: highlightMatches(user.username, searchTerm),
  }));

  res.render('explore', {
    q,
    tab,
    messages: highlightedMessages,
    users: highlightedUsers,
  });
};
