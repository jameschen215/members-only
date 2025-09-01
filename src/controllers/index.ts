import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { CreateMessageType } from '../types/message.js';

export const getAllPosts: RequestHandler = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/landing-page');
  }

  res.render('index');
};

export const getLandingPage: RequestHandler = (_req, res) => {
  res.render('landing-page');
};

export const getPostPage: RequestHandler = (req, res) => {
  res.render('create-form', { errors: null, oldInput: null });
};

export const postNewMessage: RequestHandler = async (req, res, next) => {
  console.log(req.body);
  const formData = matchedData(req) as CreateMessageType;

  console.log({ formData });
};
