import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in .env file

export const register = async (email: string, password: string, username: string): Promise<Omit<User, 'password'>> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const login = async (email: string, password: string): Promise<{ user: Omit<User, 'password'>; token: string }> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const findUserById = async (userId: number): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const deleteAccount = async (userId: number): Promise<void> => {
  await prisma.user.delete({
    where: { id: userId },
  });
};
