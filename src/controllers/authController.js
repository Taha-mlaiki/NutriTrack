import * as authService from '../services/authService.js';

export const showLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

export const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    req.session.user = user;
    res.redirect('/meals');
  } catch (err) {
    res.render('auth/login', { error: err.message });
  }
};

export const showRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

export const handleRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await authService.register(email, password);
    res.redirect('/auth/login');
  } catch (err) {
    res.render('auth/register', { error: err.message });
  }
};
