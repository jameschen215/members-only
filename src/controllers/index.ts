import { RequestHandler } from 'express';

export const getAllPosts: RequestHandler = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/landing-page');
  }

  res.render('index');
};

export const getLandingPage: RequestHandler = (req, res) => {
  res.render('landing-page');
};
