import bcrypt from 'bcryptjs';
import * as userRepository from '../repositories/userRepository.js';

export const register = async (email, password) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new Error('Email already registered');
  const hash = await bcrypt.hash(password, 10);
  return userRepository.create(email, hash);
};

export const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  return user;
};
